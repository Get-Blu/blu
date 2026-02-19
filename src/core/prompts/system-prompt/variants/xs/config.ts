import { isLocalModel } from "@utils/model-utils"
import { ModelFamily } from "@/shared/prompts"
import { BluDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { xsComponentOverrides } from "./overrides"
import { baseTemplate } from "./template"

// Type-safe variant configuration using the builder pattern
export const config = createVariant(ModelFamily.XS)
	.description("Prompt for models with a small context window.")
	.version(1)
	.tags("local", "xs", "compact")
	.labels({
		stable: 1,
		production: 1,
		advanced: 1,
	})
	.matcher((context) => {
		const providerInfo = context.providerInfo
		// Match compact local models
		return providerInfo.customPrompt === "compact" && isLocalModel(providerInfo)
	})
	.template(baseTemplate)
	.components(
		SystemPromptSection.AGENT_ROLE,
		SystemPromptSection.RULES,
		SystemPromptSection.ACT_VS_PLAN,
		SystemPromptSection.CLI_SUBAGENTS,
		SystemPromptSection.CAPABILITIES,
		SystemPromptSection.EDITING_FILES,
		SystemPromptSection.OBJECTIVE,
		SystemPromptSection.SYSTEM_INFO,
		SystemPromptSection.USER_INSTRUCTIONS,
	)
	.tools(
		BluDefaultTool.BASH,
		BluDefaultTool.FILE_READ,
		BluDefaultTool.FILE_NEW,
		BluDefaultTool.FILE_EDIT,
		BluDefaultTool.SEARCH,
		BluDefaultTool.LIST_FILES,
		BluDefaultTool.ASK,
		BluDefaultTool.ATTEMPT,
		BluDefaultTool.NEW_TASK,
		BluDefaultTool.PLAN_MODE,
	)
	.placeholders({
		MODEL_FAMILY: ModelFamily.XS,
	})
	.config({})
	.build()

// Apply component overrides after building the base configuration
// This is necessary because the builder pattern doesn't support bulk overrides
Object.assign(config.componentOverrides, xsComponentOverrides)

// Compile-time validation
const validationResult = validateVariant({ ...config, id: ModelFamily.XS }, { strict: true })
if (!validationResult.isValid) {
	console.error("XS variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid XS variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("XS variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type XsVariantConfig = typeof config
