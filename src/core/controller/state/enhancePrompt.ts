import { StringRequest } from "@shared/proto/blu/common"
import { buildApiHandler } from "@core/api"
import { Controller } from ".."

/**
 * Enhances a user prompt with AI-powered improvements.
 * Works with any configured API provider (OpenRouter, Anthropic, OpenAI, Ollama, etc.)
 * @param controller The controller instance
 * @param request The request containing the prompt to enhance
 * @returns The enhanced prompt
 */
export async function enhancePrompt(controller: Controller, request: StringRequest): Promise<StringRequest> {
	try {
		const originalPrompt = request.value

		// Get the API configuration
		const apiConfiguration = controller.stateManager.getApiConfiguration()
		const currentMode = controller.stateManager.getGlobalSettingsKey("mode")

		// Determine which provider is configured for the current mode
		const apiProvider = currentMode === "plan" ? apiConfiguration.planModeApiProvider : apiConfiguration.actModeApiProvider

		// Check if using 'blu' provider - if so, verify authentication
		if (apiProvider === "blu") {
			// Check if user is authenticated with Blu
			const { AuthService } = await import("@/services/auth/AuthService")
			const authService = AuthService.getInstance(controller)
			const authToken = await authService.getAuthToken()

			if (!authToken) {
				throw new Error(
					"Blu provider requires authentication. Please either:\n" +
						"1. Log in to your Blu account, OR\n" +
						"2. Configure a different API provider (OpenRouter, Anthropic, OpenAI, etc.) in Settings",
				)
			}
		}

		// Validate that a provider is configured
		if (!apiProvider || (apiProvider === "anthropic" && !apiConfiguration.apiKey)) {
			throw new Error(
				"No API provider configured. Please configure an API provider in Settings:\n" +
					"- OpenRouter (recommended)\n" +
					"- Anthropic\n" +
					"- OpenAI\n" +
					"- Ollama (local)\n" +
					"- Or any other supported provider",
			)
		}

		// Use existing task's API or create a temporary one
		let api
		if (controller.task) {
			api = controller.task.api
		} else {
			// Create temporary API handler for prompt enhancement
			api = buildApiHandler({ ...apiConfiguration, ulid: "temp-enhance" }, currentMode)
		}

		const enhancementPrompt =
			"You are a helpful assistant that improves user prompts. Your task is to rewrite the following prompt to make it more clear, specific, and effective for getting the best results.\n\n" +
			'Original prompt: "' +
			originalPrompt +
			'"\n\n' +
			"Provide only the improved prompt without any explanation or additional text.\n\n" +
			"Improved prompt:"

		const stream = api.createMessage(enhancementPrompt, [{ role: "user", content: originalPrompt }])

		let enhancedPrompt = ""

		for await (const chunk of stream) {
			if (chunk.type === "text") {
				enhancedPrompt += chunk.text
			}
		}

		return StringRequest.create({ value: enhancedPrompt || originalPrompt })
	} catch (error: any) {
		console.error("Failed to enhance prompt:", error)

		// If error already has a user-friendly message, use it
		const errorMessage = error?.message || String(error)

		// Check if this is an authentication error
		if (
			errorMessage.includes("401") ||
			errorMessage.includes("auth") ||
			errorMessage.includes("credentials") ||
			errorMessage.includes("Unauthorized") ||
			errorMessage.includes("BLU_ACCOUNT_AUTH_ERROR")
		) {
			throw new Error(
				"Authentication error. Please check your API configuration:\n" +
					"- If using Blu provider: Log in to your Blu account\n" +
					"- If using OpenRouter/Anthropic/OpenAI: Verify your API key in Settings\n" +
					"- Or switch to a different provider",
			)
		}

		// Check for API key errors
		if (errorMessage.includes("API key") || errorMessage.includes("apiKey") || errorMessage.includes("invalid_api_key")) {
			throw new Error("Invalid API key. Please check your API key in Settings for your configured provider.")
		}

		// For other errors, provide the actual error message
		throw new Error(`Failed to enhance prompt: ${errorMessage}`)
	}
}
