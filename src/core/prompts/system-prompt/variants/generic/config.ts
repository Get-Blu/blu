import { isGLMModelFamily, isLocalModel, isNextGenModelFamily, isNextGenModelProvider } from "@utils/model-utils"
import { ModelFamily } from "@/shared/prompts"
import { BluDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { baseTemplate } from "./template"

export const config = createVariant(ModelFamily.GENERIC)
	.description("The fallback prompt for generic use cases and models.")
	.version(1)
	.tags("fallback", "stable")
	.labels({
		stable: 1,
		fallback: 1,
	})
	// Generic matcher - fallback for everything that doesn't match other variants
	// This will match anything that doesn't match the other specific variants
	.matcher((context) => {
		const providerInfo = context.providerInfo
		if (!providerInfo.providerId || !providerInfo.model.id) {
			return true
		}
		const modelId = providerInfo.model.id.toLowerCase()
		return (
			// Not a local model with compact prompt enabled
			!(providerInfo.customPrompt === "compact" && isLocalModel(providerInfo)) &&
			// Not a next-gen model
			!(isNextGenModelProvider(providerInfo) && isNextGenModelFamily(modelId)) &&
			// Not a GLM model
			!isGLMModelFamily(modelId)
		)
	})
	.template(baseTemplate)
	.components(
		SystemPromptSection.AGENT_ROLE,
		SystemPromptSection.TOOL_USE,
		SystemPromptSection.TASK_PROGRESS,
		SystemPromptSection.MCP,
		SystemPromptSection.EDITING_FILES,
		SystemPromptSection.ACT_VS_PLAN,
		SystemPromptSection.CLI_SUBAGENTS,
		SystemPromptSection.TODO,
		SystemPromptSection.CAPABILITIES,
		SystemPromptSection.RULES,
		SystemPromptSection.SYSTEM_INFO,
		SystemPromptSection.OBJECTIVE,
		SystemPromptSection.USER_INSTRUCTIONS,
	)
	.tools(
		BluDefaultTool.BASH,
		BluDefaultTool.FILE_READ,
		BluDefaultTool.FILE_NEW,
		BluDefaultTool.FILE_EDIT,
		BluDefaultTool.SEARCH,
		BluDefaultTool.LIST_FILES,
		BluDefaultTool.LIST_CODE_DEF,
		BluDefaultTool.BROWSER,
		BluDefaultTool.MCP_USE,
		BluDefaultTool.MCP_ACCESS,
		BluDefaultTool.ASK,
		BluDefaultTool.ATTEMPT,
		BluDefaultTool.NEW_TASK,
		BluDefaultTool.PLAN_MODE,
		BluDefaultTool.MCP_DOCS,
		BluDefaultTool.TODO,
	)
	.placeholders({
		MODEL_FAMILY: "generic",
	})
	.config({})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "generic" }, { strict: true })
if (!validationResult.isValid) {
	console.error("Generic variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid generic variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	console.warn("Generic variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type GenericVariantConfig = typeof config
