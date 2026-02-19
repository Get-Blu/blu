import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { updateAutoApproveSettings } from "@/components/chat/auto-approve-menu/AutoApproveSettingsAPI"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"

interface NotificationsSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const NotificationsSettingsSection = ({ renderSectionHeader }: NotificationsSettingsSectionProps) => {
	const { autoApprovalSettings } = useExtensionState()

	const handleToggle = async () => {
		await updateAutoApproveSettings({
			...autoApprovalSettings,
			version: (autoApprovalSettings.version ?? 1) + 1,
			enableNotifications: !autoApprovalSettings.enableNotifications,
		})
	}

	return (
		<div>
			{renderSectionHeader("notifications")}
			<Section>
				<div className="px-4 py-2 space-y-3" id="enable-notifications">
					<VSCodeButton
						appearance={autoApprovalSettings.enableNotifications ? "primary" : "secondary"}
						onClick={handleToggle}
						className="w-full">
						<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
							<span className="codicon codicon-bell" />
							<span>Enable Notifications</span>
						</span>
					</VSCodeButton>
					<p className="text-xs opacity-70 leading-relaxed">
						Get notified when Blu needs your approval or when a task is done.
					</p>
				</div>
			</Section>
		</div>
	)
}

export default NotificationsSettingsSection