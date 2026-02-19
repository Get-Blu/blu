import { ExtensionMessage } from "@shared/ExtensionMessage"
import { ResetStateRequest } from "@shared/proto/blu/state"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import debounce from "debounce"
import AutoApproveBar from "../chat/auto-approve-menu/AutoApproveBar"
import {
    Bell,
    Cloud,
    Command,
    FlaskConical,
    GitBranch,
    Globe,
    Info,
    LucideIcon,
    Puzzle,
    ShieldCheck,
    MessageSquare,
    SlidersHorizontal,
    SquareMousePointer,
    SquareTerminal,
    Brain,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEvent } from "react-use"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { getEnvironmentColor } from "@/utils/environmentColors"
import { Tab, TabContent, TabHeader, TabList, TabTrigger } from "../common/Tab"
import SectionHeader from "./SectionHeader"
import AboutSection from "./sections/AboutSection"
import ApiConfigurationSection from "./sections/ApiConfigurationSection"
import BrowserSettingsSection from "./sections/BrowserSettingsSection"
import CheckpointsSettingsSection from "./sections/CheckpointsSettingsSection"
import DebugSection from "./sections/DebugSection"
import FeatureSettingsSection from "./sections/FeatureSettingsSection"
import GeneralSettingsSection from "./sections/GeneralSettingsSection"
import McpSection from "./sections/McpSection"
import ModesSection from "./sections/ModesSection"
import NotificationsSettingsSection from "./sections/NotificationsSettingsSection"
import PromptEngineeringSettingsSection from "./sections/PromptEngineeringSettingsSection"
import TerminalSettingsSection from "./sections/TerminalSettingsSection"
import YoloModeSection from "./sections/YoloMode"
const IS_DEV = process.env.IS_DEV

// Premium, clean styles for the tab system
const settingsTabsContainer =
	"flex flex-1 overflow-hidden bg-(--vscode-sideBar-background) rounded-xl shadow-lg p-4 gap-4 [&.narrow_.tab-label]:hidden"
const settingsTabList =
	"w-44 data-[compact=true]:w-12 shrink-0 flex flex-col gap-1 overflow-y-auto overflow-x-hidden border-r border-(--vscode-sideBar-background) pr-2"
const settingsTabTrigger =
	"whitespace-nowrap overflow-hidden min-w-0 h-11 px-3 py-2 box-border flex items-center rounded-lg border-l-2 border-transparent text-(--vscode-foreground) opacity-80 bg-transparent hover:bg-(--vscode-list-hoverBackground) transition-all duration-150 data-[compact=true]:w-12 data-[compact=true]:p-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--vscode-focusBorder)"
const settingsTabTriggerActive =
	"opacity-100 border-l-2 border-l-(--vscode-focusBorder) bg-(--vscode-list-activeSelectionBackground) shadow-sm"

// Tab definitions
interface SettingsTab {
	id: string
	name: string
	tooltipText: string
	headerText: string
	icon: LucideIcon
	hidden?: boolean
}

export const SETTINGS_TABS: SettingsTab[] = [
	{
		id: "api-config",
		name: "Providers",
		tooltipText: "Provider Configuration",
		headerText: "Provider Configuration",
		icon: SlidersHorizontal,
	},
	{
		id: "Modes",
		name: "Modes",
		tooltipText: "Mode Settings",
		headerText: "Mode Settings",
		icon: Command,
		hidden: false,
	},
	{
		id: "Checkpoints",
		name: "Checkpoints",
		tooltipText: "Checkpoint Settings",
		headerText: "Checkpoint Settings",
		icon: GitBranch,
		hidden: false,
	},
	{
		id: "features",
		name: "Features",
		tooltipText: "Feature Settings",
		headerText: "Feature Settings",
		icon: Puzzle,
	},
	{
		id: "notifications",
		name: "Notifications",
		tooltipText: "Notification Settings",
		headerText: "Notification Settings",
		icon: Bell,
	},
	{
		id: "mcp-server",
		name: "MCP Server",
		tooltipText: "MCP Server Settings",
		headerText: "MCP Server Settings",
		icon: Cloud,
	},
	{
		id: "auto-approve",
		name: "Auto Approve",
		tooltipText: "Auto Approve Settings",
		headerText: "Auto Approve Settings",
		icon: ShieldCheck,
	},
	{
		id: "yolo-mode",
		name: "Yolo Mode",
		tooltipText: "Yolo Mode Settings",
		headerText: "Yolo Mode Settings",
		icon: Brain,
	},
	{
		id: "browser",
		name: "Browser",
		tooltipText: "Browser Settings",
		headerText: "Browser Settings",
		icon: SquareMousePointer,
	},
	{
		id: "terminal",
		name: "Terminal",
		tooltipText: "Terminal Settings",
		headerText: "Terminal Settings",
		icon: SquareTerminal,
	},
	{
		id: "Prompt Engineering",
		name: "Prompt Engineering",
		tooltipText: "Prompt Engineering Settings",
		headerText: "Prompt Engineering Settings",
		icon: MessageSquare,
		hidden: false,
	},
	// Only show in dev mode
	{
		id: "debug",
		name: "Debug",
		tooltipText: "Debug Tools",
		headerText: "Debug",
		icon: FlaskConical,
		hidden: !IS_DEV,
	},
	{
		id: "general",
		name: "Languages",
		tooltipText: "Language Settings",
		headerText: "Language Settings",
		icon: Globe,
	},
	{
		id: "about",
		name: "About",
		tooltipText: "About Blu",
		headerText: "About",
		icon: Info,
	},
]

type SettingsViewProps = {
	onDone: () => void
	targetSection?: string
}

// Helper to render section header - moved outside component for better performance
const renderSectionHeader = (tabId: string) => {
	const tab = SETTINGS_TABS.find((t) => t.id === tabId)
	if (!tab) return null
	return (
		<SectionHeader>
			<div className="flex items-center gap-3 mb-2">
				<tab.icon className="w-7 h-7 opacity-80" />
				<div className="text-lg font-semibold tracking-tight" style={{ letterSpacing: 0.1 }}>
					{tab.headerText}
				</div>
			</div>
			<div className="h-px bg-(--vscode-sideBar-border) opacity-30 mb-2" />
		</SectionHeader>
	)
}

const SettingsView = ({ onDone, targetSection }: SettingsViewProps) => {
	// Memoize to avoid recreation
	const TAB_CONTENT_MAP = useMemo(
		() => ({
			"api-config": ApiConfigurationSection,
			general: GeneralSettingsSection,
			features: FeatureSettingsSection,
			"auto-approve": AutoApproveBar,
			notifications: NotificationsSettingsSection,
			browser: BrowserSettingsSection,
			terminal: TerminalSettingsSection,
			about: AboutSection,
			debug: DebugSection,
			Modes: ModesSection,
			Checkpoints: CheckpointsSettingsSection,
			"Prompt Engineering": PromptEngineeringSettingsSection,
			"mcp-server": McpSection,
			"yolo-mode": YoloModeSection,
		}),
		[],
	) // Empty deps - these imports never change

	const { version, environment } = useExtensionState()

	// Initialize active tab with memoized calculation
	const initialTab = useMemo(() => targetSection || SETTINGS_TABS[0].id, [targetSection])

	const [activeTab, setActiveTab] = useState<string>(initialTab)
	const [isCompactMode, setIsCompactMode] = useState(true)
	const containerRef = useRef<HTMLDivElement>(null)

	// Optimized message handler with early returns
	const handleMessage = useCallback((event: MessageEvent) => {
		const message: ExtensionMessage = event.data
		if (message.type !== "grpc_response") {
			return
		}

		const grpcMessage = message.grpc_response?.message
		if (grpcMessage?.key !== "scrollToSettings") {
			return
		}

		const tabId = grpcMessage.value
		if (!tabId) {
			return
		}

		// Check if valid tab ID
		if (SETTINGS_TABS.some((tab) => tab.id === tabId)) {
			setActiveTab(tabId)
			return
		}

		// Fallback to element scrolling
		requestAnimationFrame(() => {
			const element = document.getElementById(tabId)
			if (!element) {
				return
			}

			element.scrollIntoView({ behavior: "smooth" })
			element.style.transition = "background-color 0.5s ease"
			element.style.backgroundColor = "var(--vscode-textPreformat-background)"

			setTimeout(() => {
				element.style.backgroundColor = "transparent"
			}, 1200)
		})
	}, [])

	useEvent("message", handleMessage)

	// Memoized reset state handler
	const handleResetState = useCallback(async (resetGlobalState?: boolean) => {
		try {
			await StateServiceClient.resetState(ResetStateRequest.create({ global: resetGlobalState }))
		} catch (error) {
			console.error("Failed to reset state:", error)
		}
	}, [])

	// Update active tab when targetSection changes
	useEffect(() => {
		if (targetSection) {
			setActiveTab(targetSection)
		}
	}, [targetSection])

	// Simplified tab change handler without debugging
	const handleTabChange = useCallback((tabId: string) => {
		setActiveTab(tabId)
	}, [])

	// Optimized resize observer with debouncing
	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		const checkCompactMode = debounce((width: number) => {
			setIsCompactMode(width < 500)
		}, 100)

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0]
			if (entry) {
				checkCompactMode(entry.contentRect.width)
			}
		})

		observer.observe(container)
		return () => observer.disconnect()
	}, [])

	// Memoized tab item renderer
	const renderTabItem = useCallback(
		(tab: (typeof SETTINGS_TABS)[0]) => {
			const isActive = activeTab === tab.id
			const tabClassName = `${isActive ? `${settingsTabTrigger} ${settingsTabTriggerActive}` : settingsTabTrigger} focus:ring-0`
			const iconContainerClassName = `flex items-center gap-2 ${isCompactMode ? "justify-center" : ""}`

			const TabIcon = tab.icon
			const tabContent = (
				<div className={iconContainerClassName}>
					<TabIcon className="w-5 h-5" />
					<span className="tab-label">{tab.name}</span>
				</div>
			)

			if (isCompactMode) {
				return (
					<Tooltip key={tab.id}>
						<TooltipTrigger>
							<div
								className={tabClassName}
								data-compact={isCompactMode}
								data-testid={`tab-${tab.id}`}
								data-value={tab.id}
								onClick={() => handleTabChange(tab.id)}>
								{tabContent}
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">{tab.tooltipText}</TooltipContent>
					</Tooltip>
				)
			}

			return (
				<TabTrigger
					className={tabClassName}
					data-compact={isCompactMode}
					data-testid={`tab-${tab.id}`}
					key={tab.id}
					value={tab.id}>
					{tabContent}
				</TabTrigger>
			)
		},
		[activeTab, isCompactMode, handleTabChange],
	)

	// Memoized active content component
	const ActiveContent = useMemo(() => {
		const Component = TAB_CONTENT_MAP[activeTab as keyof typeof TAB_CONTENT_MAP]
		if (!Component) {
			return null
		}

		// Special props for specific components
		const props: any = { renderSectionHeader }
		if (activeTab === "debug") {
			props.onResetState = handleResetState
		} else if (activeTab === "about") {
			props.version = version
		}

		return <Component {...props} />
	}, [activeTab, handleResetState, version])

	const titleColor = getEnvironmentColor(environment)

	return (
		<Tab>
			<TabHeader className="flex justify-between items-center gap-2 px-2 py-3 mb-2 border-b border-(--vscode-sideBar-border) bg-transparent rounded-t-xl">
				<div className="flex items-center gap-2">
					<h3 className="text-xl font-bold m-0 tracking-tight" style={{ color: titleColor, letterSpacing: 0.2 }}>
						Settings
					</h3>
				</div>
				<div className="flex gap-2">
					<VSCodeButton appearance="primary" style={{ minWidth: 80, fontWeight: 600, fontSize: 15 }} onClick={onDone}>
						Done
					</VSCodeButton>
				</div>
			</TabHeader>

			<div className={`${settingsTabsContainer} ${isCompactMode ? "narrow" : ""}`} ref={containerRef}>
				<TabList
					className={settingsTabList}
					data-compact={isCompactMode}
					onValueChange={handleTabChange}
					value={activeTab}>
					{SETTINGS_TABS.filter((tab) => !tab.hidden).map(renderTabItem)}
				</TabList>

				<TabContent className="flex-1 overflow-auto px-2 py-1">{ActiveContent}</TabContent>
			</div>
		</Tab>
	)
}

export default SettingsView
