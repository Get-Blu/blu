import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"
import { updateSetting } from "../utils/settingsHandlers"

interface CheckpointsSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const CheckpointsSettingsSection = ({ renderSectionHeader }: CheckpointsSettingsSectionProps) => {
	const { enableCheckpointsSetting } = useExtensionState()

	return (
		<div>
			{renderSectionHeader("Checkpoints")}
			<Section>
				<div className="px-4 py-2 space-y-3">
					<VSCodeButton
						appearance={enableCheckpointsSetting ? "primary" : "secondary"}
						onClick={() => updateSetting("enableCheckpointsSetting", !enableCheckpointsSetting)}
						className="w-full">
						<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
							<span className="codicon codicon-git-commit" />
							<span>Enable Checkpoints</span>
						</span>
					</VSCodeButton>
					<p className="text-xs opacity-70 leading-relaxed">
						Saves checkpoints of your workspace throughout the task using git. May not work well with large
						workspaces.
					</p>
				</div>
			</Section>
		</div>
	)
}

export default CheckpointsSettingsSection