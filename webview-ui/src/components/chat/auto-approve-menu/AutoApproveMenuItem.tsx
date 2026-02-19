import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import styled from "styled-components"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ActionMetadata } from "./types"

interface AutoApproveMenuItemProps {
	action: ActionMetadata
	isChecked: (action: ActionMetadata) => boolean
	onToggle: (action: ActionMetadata, checked: boolean) => Promise<void>
	showIcon?: boolean
	disabled?: boolean
}

const SubOptionAnimateIn = styled.div<{ show: boolean }>`
	position: relative;
	transform: ${(props) => (props.show ? "scaleY(1)" : "scaleY(0)")};
	transform-origin: top;
	padding-left: 24px;
	opacity: ${(props) => (props.show ? "1" : "0")};
	height: ${(props) => (props.show ? "auto" : "0")};
	overflow: visible;
	transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`

const AutoApproveMenuItem = ({ action, isChecked, onToggle, showIcon = true, disabled = false }: AutoApproveMenuItemProps) => {
	const checked = isChecked(action)

	const onChange = async () => {
		if (disabled) {
			return
		}
		await onToggle(action, !checked)
	}

	const content = (
		<div className="w-full mb-3" style={{ opacity: disabled ? 0.5 : 1 }}>
			<Tooltip>
				<TooltipContent showArrow={false}>{action.description}</TooltipContent>
				<TooltipTrigger asChild>
					<VSCodeButton
						appearance={checked ? "primary" : "secondary"}
						onClick={onChange}
						disabled={disabled}
						className="w-full">
						<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
							{showIcon && <span className={`codicon ${action.icon}`}></span>}
							<span>{action.label}</span>
						</span>
					</VSCodeButton>
				</TooltipTrigger>
			</Tooltip>
			{action.subAction && (
				<SubOptionAnimateIn show={checked}>
					<AutoApproveMenuItem action={action.subAction} isChecked={isChecked} onToggle={onToggle} />
				</SubOptionAnimateIn>
			)}
		</div>
	)

	return content
}

export default AutoApproveMenuItem