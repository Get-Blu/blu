import { StringRequest } from "@shared/proto/blu/common"
import { useRef } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { UiServiceClient } from "@/services/grpc-client"
import { getAsVar, VSC_TITLEBAR_INACTIVE_FOREGROUND } from "@/utils/vscStyles"
import AutoApproveModal from "./AutoApproveModal"
import { ACTION_METADATA } from "./constants"

interface AutoApproveBarProps {
	style?: React.CSSProperties
}

const AutoApproveBar = ({ style }: AutoApproveBarProps) => {
	const { autoApprovalSettings, yoloModeToggled, navigateToSettings } = useExtensionState()
	const buttonRef = useRef<HTMLDivElement>(null)

	const handleNavigateToFeatures = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		navigateToSettings()

		setTimeout(async () => {
			try {
				await UiServiceClient.scrollToSettings(StringRequest.create({ value: "features" }))
			} catch (error) {
				console.error("Error scrolling to features settings:", error)
			}
		}, 300)
	}

	const borderColor = `color-mix(in srgb, ${getAsVar(VSC_TITLEBAR_INACTIVE_FOREGROUND)} 20%, transparent)`
	const borderGradient = `linear-gradient(to bottom, ${borderColor} 0%, transparent 50%)`
	const bgGradient = `linear-gradient(to bottom, color-mix(in srgb, var(--vscode-sideBar-background) 96%, white) 0%, transparent 80%)`

	// If YOLO mode is enabled, show disabled message
	if (yoloModeToggled) {
		return (
			<div
				className="mx-3.5 select-none break-words relative"
				style={{
					borderTop: `0.5px solid ${borderColor}`,
					borderRadius: "8px 8px 0 0",
					background: bgGradient,
					opacity: 0.5,
					...style,
				}}>
				{/* Left border gradient */}
				<div
					className="absolute left-0 pointer-events-none"
					style={{
						width: 0.5,
						top: 3,
						height: "100%",
						background: borderGradient,
					}}
				/>
				{/* Right border gradient */}
				<div
					className="absolute right-0 top-0 pointer-events-none"
					style={{
						width: 0.5,
						top: 3,
						height: "100%",
						background: borderGradient,
					}}
				/>

				<div className="pt-4 pb-3.5 px-3.5">
					<div className="text-sm mb-1">Auto-approve: YOLO</div>
					<div className="text-muted-foreground text-xs">
						YOLO mode is enabled.{" "}
						<span className="underline cursor-pointer hover:text-foreground" onClick={handleNavigateToFeatures}>
							Disable it in Settings
						</span>
						.
					</div>
				</div>
			</div>
		)
	}

	return (
		<div style={style}>
			<AutoApproveModal
				ACTION_METADATA={ACTION_METADATA}
				buttonRef={buttonRef}
				isVisible={true}
				setIsVisible={() => {}}
			/>
		</div>
	)
}

export default AutoApproveBar