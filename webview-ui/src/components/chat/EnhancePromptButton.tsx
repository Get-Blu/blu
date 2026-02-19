import { StringRequest } from "@shared/proto/blu/common"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancePromptButtonProps {
	inputValue: string
	onEnhanced: (enhancedPrompt: string) => void
	disabled?: boolean
}

const EnhancePromptButton = ({ inputValue, onEnhanced, disabled }: EnhancePromptButtonProps) => {
	const { promptEngineeringSettings } = useExtensionState()
	const [isEnhancing, setIsEnhancing] = useState(false)

	const isEnabled = promptEngineeringSettings?.enhancePromptEnabled ?? false
	const buttonDisabled = disabled || isEnhancing || !inputValue.trim() || !isEnabled

	const handleEnhance = async () => {
		if (buttonDisabled) return
		setIsEnhancing(true)

		try {
			const response = await StateServiceClient.enhancePrompt(StringRequest.create({ value: inputValue }))
			onEnhanced(response.value)
		} catch (error: any) {
			console.error("Failed to enhance prompt:", error)
			
			// Extract the error message
			const errorMessage = error?.message || String(error)
			
			// Check for authentication errors
			if (
				errorMessage.includes("401") ||
				errorMessage.includes("auth") ||
				errorMessage.includes("credentials") ||
				errorMessage.includes("Authentication required")
			) {
				alert(
					"Authentication Required\n\n" +
					"To use prompt enhancement, you need to:\n" +
					"1. Configure an API key in Settings, or\n" +
					"2. Log in to your Blu account\n\n" +
					"Please check your API configuration in the Settings panel."
				)
			} else {
				// Show generic error for other issues
				alert(`Failed to enhance prompt: ${errorMessage}`)
			}
		} finally {
			setIsEnhancing(false)
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger>
				<VSCodeButton
					appearance="icon"
					aria-label="Enhance Prompt"
					className="p-0 m-0 flex items-center bg-input-background border border-[rgba(255,255,255,0.2)]"
					disabled={buttonDisabled}
					style={{ borderRadius: "8px" }}
					onClick={handleEnhance}>
					<div className="flex items-center gap-1 px-2 py-1">
						<Sparkles size={14} className={isEnhancing ? "animate-pulse" : ""} />
					</div>
				</VSCodeButton>
			</TooltipTrigger>
			<TooltipContent>
				{!isEnabled
					? "Turn on in Prompt Engineering settings"
					: isEnhancing
						? "Enhancing..."
						: "Enhance your prompt with AI"}
			</TooltipContent>
		</Tooltip>
	)
}

export default EnhancePromptButton
