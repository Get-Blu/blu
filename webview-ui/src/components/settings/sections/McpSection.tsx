import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { ExternalLink } from "lucide-react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import Section from "../Section"

interface McpSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const McpSection = ({ renderSectionHeader }: McpSectionProps) => {
	const { mcpServers, navigateToMcp } = useExtensionState()

	return (
		<div>
			{renderSectionHeader("mcp-server")}

			<Section>
				<div className="px-4 py-2 space-y-4">
					<div>
						<h4 className="text-sm font-semibold mb-2">What is MCP?</h4>
						<p className="text-xs opacity-80 leading-relaxed">
							Model Context Protocol (MCP) is an open standard that enables AI assistants to connect to external data
							sources, tools, and systems. MCP servers provide tools and resources that can extend the capabilities of
							this AI assistant.
						</p>
						<a
							className="inline-flex items-center gap-1 mt-2 text-xs hover:underline"
							href="https://modelcontextprotocol.io"
							rel="noopener noreferrer"
							target="_blank">
							Learn more about MCP <ExternalLink size={12} />
						</a>
					</div>

					<div className="border-t border-white/10 pt-4">
						<div className="mb-4">
							<p className="text-sm font-semibold mb-2">MCP Servers</p>
							<p className="text-xs opacity-70 mb-3">
								{mcpServers.length} server{mcpServers.length !== 1 ? "s" : ""} configured
							</p>
							<VSCodeButton onClick={() => navigateToMcp()} className="w-full">
								<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
									<span className="codicon codicon-server" />
									<span>Open MCP</span>
								</span>
							</VSCodeButton>
						</div>

						<div className="space-y-3">
							<div>
								<VSCodeButton
									appearance="secondary"
									onClick={() => navigateToMcp("configure")}
									className="w-full">
									<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
										<span className="codicon codicon-gear" />
										<span>Edit Global MCP Servers</span>
									</span>
								</VSCodeButton>
								<p className="text-xs opacity-70 mt-1.5">
									Configure MCP servers that are available across all projects
								</p>
							</div>

							<div>
								<VSCodeButton
									appearance="secondary"
									onClick={() => navigateToMcp("configure")}
									className="w-full">
									<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
										<span className="codicon codicon-folder-library" />
										<span>Edit Project MCP Servers</span>
									</span>
								</VSCodeButton>
								<p className="text-xs opacity-70 mt-1.5">
									Configure MCP servers specific to this project
								</p>
							</div>
						</div>
					</div>

					<div className="border-t border-white/10 pt-4">
						<div className="flex items-start gap-2">
							<span className="codicon codicon-info mt-0.5" />
							<p className="text-xs opacity-70 leading-relaxed">
								MCP servers can provide tools, resources, and prompts to enhance your AI assistant's capabilities.
							</p>
						</div>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default McpSection