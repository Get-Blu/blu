import { name, publisher, version } from "../package.json"

const prefix = name === "blu" ? "blu" : name

/**
 * List of commands with the name of the extension they are registered under.
 * These should match the command IDs defined in package.json.
 * For Nightly build, the publish script has updated all the commands to use the extension name as prefix.
 * In production, all commands are registered under "blu" for consistency.
 */
const BluCommands = {
	PlusButton: prefix + ".plusButtonClicked",
	McpButton: prefix + ".mcpButtonClicked",
	SettingsButton: prefix + ".settingsButtonClicked",
	HistoryButton: prefix + ".historyButtonClicked",
	OpenInEditor: prefix + ".openInEditor",
	TerminalOutput: prefix + ".addTerminalOutputToChat",
	AddToChat: prefix + ".addToChat",
	FixWithBlu: prefix + ".fixWithBlu",
	ExplainCode: prefix + ".explainCode",
	ImproveCode: prefix + ".improveCode",
	FocusChatInput: prefix + ".focusChatInput",
	Walkthrough: prefix + ".openWalkthrough",
	GenerateCommit: prefix + ".generateGitCommitMessage",
	AbortCommit: prefix + ".abortGitCommitMessage",
	ReconstructTaskHistory: prefix + ".reconstructTaskHistory",
	OpenGitHubRepo: prefix + ".openGitHubRepo",
	ViewFileHistory: prefix + ".viewFileHistory",
}

/**
 * IDs for the views registered by the extension.
 * These should match the name + view IDs defined in package.json.
 */
const BluViewIds = {
	Sidebar: name + ".SidebarProvider",
}

/**
 * The registry info for the extension, including its ID, name, version, commands, and views
 * registered for the current host.
 */
export const ExtensionRegistryInfo = {
	id: publisher + "." + name,
	name,
	version,
	publisher,
	commands: BluCommands,
	views: BluViewIds,
}
