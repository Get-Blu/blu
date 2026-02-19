import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import Section from "../Section"

interface AboutSectionProps {
	version: string
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const AboutSection = ({ version, renderSectionHeader }: AboutSectionProps) => {
	return (
		<div>
			{renderSectionHeader("about")}
			<Section>
				<div className="px-4 py-2 space-y-4">
					<div>
						<h2 className="text-lg font-semibold mb-2">Blu v{version}</h2>
						<p className="text-sm leading-relaxed">
							Blu is your coding buddy that helps you build software. It can create and edit files, explore your 
							project, browse the web, and run commands in your terminal. Just tell it what you need, and it'll 
							handle the rest.
						</p>
					</div>

					<div className="space-y-3">
						<div>
							<VSCodeButton
								appearance="secondary"
								onClick={() => window.open("https://github.com/GarvAgnihotri/blu", "_blank")}
								className="w-full">
								<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
									<span className="codicon codicon-github" />
									<span>GitHub</span>
								</span>
							</VSCodeButton>
						</div>

						<div>
							<VSCodeButton
								appearance="secondary"
								onClick={() => window.open("https://docs.getblu.in", "_blank")}
								className="w-full">
								<span className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap">
									<span className="codicon codicon-book" />
									<span>Documentation</span>
								</span>
							</VSCodeButton>
						</div>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default AboutSection