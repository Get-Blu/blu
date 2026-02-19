import { BooleanRequest } from "@shared/proto/blu/common"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import BluLogoWhite from "@/assets/BluLogoWhite"
import ApiOptions from "@/components/settings/ApiOptions"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { validateApiConfiguration } from "@/utils/validate"

const WelcomeView = memo(() => {
	const { apiConfiguration, mode } = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)

	const disableLetsGoButton = apiErrorMessage != null



	const handleSubmit = async () => {
		try {
			await StateServiceClient.setWelcomeViewCompleted(BooleanRequest.create({ value: true }))
		} catch (error) {
			console.error("Failed to update API configuration or complete welcome view:", error)
		}
	}

	useEffect(() => {
		setApiErrorMessage(validateApiConfiguration(mode, apiConfiguration))
	}, [apiConfiguration, mode])

	return (
		<div className="fixed inset-0 p-0 flex flex-col">
			<div className="h-full px-10 overflow-auto flex flex-col gap-2.5">
				<div className="flex flex-col items-center justify-center my-6">
					<BluLogoWhite className="size-25" />
					<h2 className="text-5xl font-extrabold text-center mt-4">Blu</h2>
					<p className="mt-3 text-center max-w-xl">
						Blu simplifies AI workflows inside your editor, providing fast access to powerful models, seamless integrations, and smart tooling to boost developer productivity.
					</p>
				</div>

				<p className="text-(--vscode-descriptionForeground)">
					To get started, please configure an AI provider using your own API key. This gives you full control over costs and access to world-class models.
				</p>

				<div className="mt-4.5">
					<ApiOptions currentMode={mode} showModelOptions={false} />
					<VSCodeButton className="mt-0.75 w-full" disabled={disableLetsGoButton} onClick={handleSubmit}>
						Let's go!
					</VSCodeButton>
				</div>

				<div className="mt-6 text-center">
					<h3 className="text-sm text-(--vscode-descriptionForeground)">
						Thank you for choosing Blu — we appreciate your support today
					</h3>
					<h3 className="text-sm text-(--vscode-descriptionForeground) mt-1">
						Donate to support Blu development and help us improve features
					</h3>
				</div>
			</div>
		</div>
	)
})

export default WelcomeView
