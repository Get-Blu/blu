import { getWorkspaceBasename } from "@core/workspace"
import type { ToggleBluRuleRequest } from "@shared/proto/blu/file"
import { ToggleBluRules } from "@shared/proto/blu/file"
import { telemetryService } from "@/services/telemetry"
import type { Controller } from "../index"

/**
 * Toggles a Blu rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated Blu rule toggles
 */
export async function toggleBluRule(controller: Controller, request: ToggleBluRuleRequest): Promise<ToggleBluRules> {
	const { isGlobal, rulePath, enabled } = request

	if (!rulePath || typeof enabled !== "boolean" || typeof isGlobal !== "boolean") {
		console.error("toggleBluRule: Missing or invalid parameters", {
			rulePath,
			isGlobal: typeof isGlobal === "boolean" ? isGlobal : `Invalid: ${typeof isGlobal}`,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for toggleBluRule")
	}

	// This is the same core logic as in the original handler
	if (isGlobal) {
		const toggles = controller.stateManager.getGlobalSettingsKey("globalBluRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setGlobalState("globalBluRulesToggles", toggles)
	} else {
		const toggles = controller.stateManager.getWorkspaceStateKey("localBluRulesToggles")
		toggles[rulePath] = enabled
		controller.stateManager.setWorkspaceState("localBluRulesToggles", toggles)
	}

	// Track rule toggle telemetry with current task context
	if (controller.task?.ulid) {
		// Extract just the filename for privacy (no full paths)
		const ruleFileName = getWorkspaceBasename(rulePath, "Controller.toggleBluRule")
		telemetryService.captureBluRuleToggled(controller.task.ulid, ruleFileName, enabled, isGlobal)
	}

	// Get the current state to return in the response
	const globalToggles = controller.stateManager.getGlobalSettingsKey("globalBluRulesToggles")
	const localToggles = controller.stateManager.getWorkspaceStateKey("localBluRulesToggles")

	return ToggleBluRules.create({
		globalBluRulesToggles: { toggles: globalToggles },
		localBluRulesToggles: { toggles: localToggles },
	})
}
