import { VSCodeCheckbox, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { PlanActMode, TogglePlanActModeRequest, UpdateSettingsRequest } from "@shared/proto/blu/state"
import { StateServiceClient } from "@/services/grpc-client"
import Section from "../Section"
import { Command } from "lucide-react"

interface ModesSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const ModesSection = ({ renderSectionHeader }: ModesSectionProps) => {
	const { mode, planActSeparateModelsSetting } = useExtensionState()

	const handleModeChange = (newValue: string) => {
		const newMode: PlanActMode = newValue === "plan" ? PlanActMode.PLAN : PlanActMode.ACT
		StateServiceClient.togglePlanActModeProto(TogglePlanActModeRequest.create({ mode: newMode }))
	}

	const handleSeparateModelsChange = async (checked: boolean) => {
		try {
			await StateServiceClient.updateSettings(
				UpdateSettingsRequest.create({
					planActSeparateModelsSetting: checked,
				}),
			)
		} catch (error) {
			console.error("Failed to update separate models setting:", error)
		}
	}

	const currentModeValue = mode

	return (
		<div>
			{renderSectionHeader("Modes")}
			<Section>
				<div style={{ marginBottom: 20 }}>
					<div className="flex items-center gap-2 mb-4">
						<Command className="w-5 h-5 opacity-80" />
						<div className="text-sm font-medium">Active Mode</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-(--vscode-foreground) mb-1" htmlFor="mode-dropdown">
							Mode Selection
						</label>
						<VSCodeDropdown
							className="w-full"
							currentValue={currentModeValue}
							id="mode-dropdown"
							onChange={(e: any) => handleModeChange(e.target.currentValue)}>
							<VSCodeOption value="plan">Plan Mode</VSCodeOption>
							<VSCodeOption value="act">Act Mode</VSCodeOption>
						</VSCodeDropdown>
						<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
							Select the mode for Blu to operate in. Plan mode focuses on planning and analysis, while Act mode
							focuses on execution and implementation.
						</p>
					</div>
					<div style={{ marginTop: 20 }}>
						<div className="text-sm font-medium mb-2">Available Modes</div>
						<div className="flex flex-col gap-2">
							<div
								className={`p-3 rounded-md border ${
									mode === "plan"
										? "bg-(--vscode-list-activeSelectionBackground) border-(--vscode-focusBorder)"
										: "bg-(--vscode-list-hoverBackground) border-transparent"
								}`}>
								<div className="font-medium">Plan Mode</div>
								<p className="text-xs mt-1 text-(--vscode-descriptionForeground)">
									Analyzes tasks, creates detailed plans, and prepares implementation strategies without making
									changes to files.
								</p>
							</div>
							<div
								className={`p-3 rounded-md border ${
									mode === "act"
										? "bg-(--vscode-list-activeSelectionBackground) border-(--vscode-focusBorder)"
										: "bg-(--vscode-list-hoverBackground) border-transparent"
								}`}>
								<div className="font-medium">Act Mode</div>
								<p className="text-xs mt-1 text-(--vscode-descriptionForeground)">
									Executes plans, makes changes to files, runs commands, and implements solutions directly.
								</p>
							</div>
						</div>
					</div>
					<div style={{ marginTop: 20 }}>
						<VSCodeCheckbox
							checked={planActSeparateModelsSetting}
							className="mb-[5px]"
							onChange={(e: any) => {
								const checked = e.target.checked === true
								handleSeparateModelsChange(checked)
							}}>
							Use different models for Plan and Act modes
						</VSCodeCheckbox>
						<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
							Switching between Plan and Act mode will persist the API and model used in the previous mode. This may
							be helpful e.g. when using a strong reasoning model to architect a plan for a cheaper coding model to
							act on.
						</p>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default memo(ModesSection)

