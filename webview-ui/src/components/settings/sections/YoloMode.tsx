import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"
import { updateSetting } from "../utils/settingsHandlers"

interface YoloModeSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const YoloModeSection = ({ renderSectionHeader }: YoloModeSectionProps) => {
	const { yoloModeToggled, remoteConfigSettings } = useExtensionState()

	const handleToggle = () => {
		if (remoteConfigSettings?.yoloModeToggled !== undefined) {
			return // Managed by remote config
		}
		updateSetting("yoloModeToggled", !yoloModeToggled)
	}

	const isLocked = remoteConfigSettings?.yoloModeToggled !== undefined

	return (
		<div>
			{renderSectionHeader("yolomode")}
			<Section>
				<div className="px-4 py-2 space-y-3" id="yolo-mode">
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<VSCodeButton
									appearance={yoloModeToggled ? "primary" : "secondary"}
									onClick={handleToggle}
									disabled={isLocked}
									className="w-full">
									<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
										<span className="codicon codicon-zap" />
										<span>{yoloModeToggled ? "YOLO Mode Enabled" : "Enable YOLO Mode"}</span>
										{isLocked && <i className="codicon codicon-lock text-sm ml-1" />}
									</span>
								</VSCodeButton>
							</div>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs" hidden={!isLocked} side="top">
							This setting is managed by your organization's remote configuration
						</TooltipContent>
					</Tooltip>
					<p className="text-xs text-[var(--vscode-errorForeground)] leading-relaxed">
						<span className="font-semibold">EXPERIMENTAL & DANGEROUS:</span> This mode disables safety checks and user
						confirmations. Blu will automatically approve all actions without asking. Use with extreme caution.
					</p>
				</div>
			</Section>
		</div>
	)
}

export default YoloModeSection
