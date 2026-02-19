import { StringRequest } from "@shared/proto/blu/common"
import React, { useRef } from "react"
import { useClickAway } from "react-use"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { useAutoApproveActions } from "@/hooks/useAutoApproveActions"
import { UiServiceClient } from "@/services/grpc-client"
import AutoApproveMenuItem from "./AutoApproveMenuItem"
import { ActionMetadata } from "./types"

interface AutoApproveModalProps {
	isVisible: boolean
	setIsVisible: (visible: boolean) => void
	buttonRef: React.RefObject<HTMLDivElement>
	ACTION_METADATA: ActionMetadata[]
}

const AutoApproveModal: React.FC<AutoApproveModalProps> = ({ isVisible, setIsVisible, buttonRef, ACTION_METADATA }) => {
	const { navigateToSettings } = useExtensionState()
	const { isChecked, updateAction } = useAutoApproveActions()

	const handleNotificationsLinkClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		navigateToSettings()

		setTimeout(async () => {
			try {
				await UiServiceClient.scrollToSettings(StringRequest.create({ value: "general" }))
			} catch (error) {
				console.error("Error scrolling to general settings:", error)
			}
		}, 300)
	}

	const modalRef = useRef<HTMLDivElement>(null)

	useClickAway(modalRef, (e) => {
		if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
			return
		}
		setIsVisible(false)
	})

	if (!isVisible) {
		return null
	}

	return (
		<div ref={modalRef}>
			<div
				className="overflow-y-auto pb-3 px-3.5 overscroll-contain"
				style={{
					maxHeight: "60vh",
				}}>
				<div className="space-y-0">
					{ACTION_METADATA.map((action) => (
						<AutoApproveMenuItem action={action} isChecked={isChecked} key={action.id} onToggle={updateAction} />
					))}
				</div>
			</div>
		</div>
	)
}

export default AutoApproveModal