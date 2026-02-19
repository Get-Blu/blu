import { McpDisplayMode, OpenaiReasoningEffort, UpdateSettingsRequest } from "@shared/proto/blu/state"
import { StateServiceClient } from "@/services/grpc-client"

/**
 * Converts values to their corresponding proto format
 * @param field - The field name
 * @param value - The value to convert
 * @returns The converted value
 * @throws Error if the value is invalid for the field
 */
const convertToProtoValue = (field: keyof UpdateSettingsRequest, value: any): any => {
	if (field === "openaiReasoningEffort" && typeof value === "string") {
		switch (value) {
			case "minimal":
				return OpenaiReasoningEffort.MINIMAL
			case "low":
				return OpenaiReasoningEffort.LOW
			case "medium":
				return OpenaiReasoningEffort.MEDIUM
			case "high":
				return OpenaiReasoningEffort.HIGH
			default:
				throw new Error(`Invalid OpenAI reasoning effort value: ${value}`)
		}
	} else if (field === "mcpDisplayMode" && typeof value === "string") {
		switch (value) {
			case "rich":
				return McpDisplayMode.RICH
			case "plain":
				return McpDisplayMode.PLAIN
			case "markdown":
				return McpDisplayMode.MARKDOWN
			default:
				throw new Error(`Invalid MCP display mode value: ${value}`)
		}
	}
	return value
}

/**
 * Updates a single field in the settings.
 *
 * @param field - The field key to update
 * @param value - The new value for the field
 */
export const updateSetting = (field: keyof UpdateSettingsRequest, value: any) => {
	console.log("[Settings Debug] === UPDATE SETTING START ===")
	console.log("[Settings Debug] Field name:", field)
	console.log("[Settings Debug] Original value:", value)
	console.log("[Settings Debug] Value type:", typeof value)

	const updateRequest: Partial<UpdateSettingsRequest> = {}

	const convertedValue = convertToProtoValue(field, value)

	// Direct assignment - the TypeScript proto interfaces already use the correct field names
	updateRequest[field] = convertedValue

	console.log("[Settings Debug] Converted value:", convertedValue)
	console.log("[Settings Debug] Full update request:", updateRequest)
	console.log("[Settings Debug] Request keys:", Object.keys(updateRequest))
	console.log("[Settings Debug] Request object details:", JSON.stringify(updateRequest, null, 2))
	console.log("[Settings Debug] === SENDING TO BACKEND ===")

	StateServiceClient.updateSettings(UpdateSettingsRequest.create(updateRequest))
		.then(() => {
			console.log("[Settings Debug] Update request sent successfully")
		})
		.catch((error) => {
			console.error("[Settings Debug] Failed to update setting:", field)
			console.error("[Settings Debug] Error details:", error)
		})
}
