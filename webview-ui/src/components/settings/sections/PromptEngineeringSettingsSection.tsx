import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"
import { updateSetting } from "../utils/settingsHandlers"

interface PromptEngineeringSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const PromptEngineeringSettingsSection = ({ renderSectionHeader }: PromptEngineeringSettingsSectionProps) => {
	const { promptEngineeringSettings } = useExtensionState()
	const [localSettings, setLocalSettings] = useState(promptEngineeringSettings)

	useEffect(() => {
		console.log("[PE Debug] === USEEFFECT: SYNCING STATE ===")
		console.log("[PE Debug] promptEngineeringSettings from context:", promptEngineeringSettings)
		console.log("[PE Debug] Setting localSettings to:", promptEngineeringSettings)
		setLocalSettings(promptEngineeringSettings)
		console.log("[PE Debug] === USEEFFECT: STATE SYNCED ===")
	}, [promptEngineeringSettings])

	const toggleEnabled = () => {
		console.log("[PE Debug] === TOGGLE ENABLED START ===")
		const enabled = !localSettings?.enabled
		console.log("[PE Debug] toggleEnabled called with:", enabled)
		console.log("[PE Debug] Current localSettings:", localSettings)
		const newSettings = {
			enabled: enabled,
			enhancePromptEnabled: localSettings?.enhancePromptEnabled ?? false,
		}
		console.log("[PE Debug] newSettings to send:", newSettings)
		setLocalSettings(newSettings)
		updateSetting("promptEngineeringSettings", newSettings)
		console.log("[PE Debug] === TOGGLE ENABLED END ===")
	}

	const toggleEnhancePromptEnabled = () => {
		console.log("[PE Debug] === TOGGLE ENHANCE PROMPT ENABLED START ===")
		const enabled = !localSettings?.enhancePromptEnabled
		console.log("[PE Debug] toggleEnhancePromptEnabled called with:", enabled)
		console.log("[PE Debug] Current localSettings:", localSettings)
		const newSettings = {
			enabled: localSettings?.enabled ?? false,
			enhancePromptEnabled: enabled,
		}
		console.log("[PE Debug] newSettings to send:", newSettings)
		setLocalSettings(newSettings)
		updateSetting("promptEngineeringSettings", newSettings)
		console.log("[PE Debug] === TOGGLE ENHANCE PROMPT ENABLED END ===")
	}

	return (
		<div>
			{renderSectionHeader("Prompt Engineering")}
			<Section>
				<div className="px-4 py-2 space-y-3">
					<div>
						<VSCodeButton
							appearance={localSettings?.enabled ? "primary" : "secondary"}
							onClick={toggleEnabled}
							className="w-full">
							<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
								<span className="codicon codicon-wand" />
								<span>Enable Prompt Engineering</span>
							</span>
						</VSCodeButton>
						<p className="text-xs opacity-70 leading-relaxed mt-2">
							Enhance your prompts with AI-powered improvements before sending.
						</p>
					</div>

					<div>
						<VSCodeButton
							appearance={localSettings?.enhancePromptEnabled ? "primary" : "secondary"}
							onClick={toggleEnhancePromptEnabled}
							className="w-full">
							<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
								<span className="codicon codicon-sparkle" />
								<span>Show Enhance Prompt Button</span>
							</span>
						</VSCodeButton>
						<p className="text-xs opacity-70 leading-relaxed mt-2">
							Display a button in chat input to enhance your prompts.
						</p>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default PromptEngineeringSettingsSection