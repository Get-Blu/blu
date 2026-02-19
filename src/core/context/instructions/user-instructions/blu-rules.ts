import { getRuleFilesTotalContent, synchronizeRuleToggles } from "@core/context/instructions/user-instructions/rule-helpers"
import { formatResponse } from "@core/prompts/responses"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { BluRulesToggles } from "@shared/blu-rules"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import fs from "fs/promises"
import path from "path"
import { Controller } from "@/core/controller"

export const getGlobalBluRules = async (globalBluRulesFilePath: string, toggles: BluRulesToggles) => {
	if (await fileExistsAtPath(globalBluRulesFilePath)) {
		if (await isDirectory(globalBluRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalBluRulesFilePath)
				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, globalBluRulesFilePath, toggles)
				if (rulesFilesTotalContent) {
					const bluRulesFileInstructions = formatResponse.bluRulesGlobalDirectoryInstructions(
						globalBluRulesFilePath,
						rulesFilesTotalContent,
					)
					return bluRulesFileInstructions
				}
			} catch {
				console.error(`Failed to read .blurules directory at ${globalBluRulesFilePath}`)
			}
		} else {
			console.error(`${globalBluRulesFilePath} is not a directory`)
			return undefined
		}
	}

	return undefined
}

export const getLocalBluRules = async (cwd: string, toggles: BluRulesToggles) => {
	const bluRulesFilePath = path.resolve(cwd, GlobalFileNames.bluRules)

	let bluRulesFileInstructions: string | undefined

	if (await fileExistsAtPath(bluRulesFilePath)) {
		if (await isDirectory(bluRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(bluRulesFilePath, [
					[".blurules", "workflows"],
					[".blurules", "hooks"],
				])

				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, cwd, toggles)
				if (rulesFilesTotalContent) {
					bluRulesFileInstructions = formatResponse.bluRulesLocalDirectoryInstructions(cwd, rulesFilesTotalContent)
				}
			} catch {
				console.error(`Failed to read .blurules directory at ${bluRulesFilePath}`)
			}
		} else {
			try {
				if (bluRulesFilePath in toggles && toggles[bluRulesFilePath] !== false) {
					const ruleFileContent = (await fs.readFile(bluRulesFilePath, "utf8")).trim()
					if (ruleFileContent) {
						bluRulesFileInstructions = formatResponse.bluRulesLocalFileInstructions(cwd, ruleFileContent)
					}
				}
			} catch {
				console.error(`Failed to read .blurules file at ${bluRulesFilePath}`)
			}
		}
	}

	return bluRulesFileInstructions
}

export async function refreshBluRulesToggles(
	controller: Controller,
	workingDirectory: string,
): Promise<{
	globalToggles: BluRulesToggles
	localToggles: BluRulesToggles
}> {
	// Global toggles
	const globalBluRulesToggles = controller.stateManager.getGlobalSettingsKey("globalBluRulesToggles")
	const globalBluRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalBluRulesFilePath, globalBluRulesToggles)
	controller.stateManager.setGlobalState("globalBluRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localBluRulesToggles = controller.stateManager.getWorkspaceStateKey("localBluRulesToggles")
	const localBluRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.bluRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localBluRulesFilePath, localBluRulesToggles, "", [
		[".blurules", "workflows"],
		[".blurules", "hooks"],
	])
	controller.stateManager.setWorkspaceState("localBluRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
