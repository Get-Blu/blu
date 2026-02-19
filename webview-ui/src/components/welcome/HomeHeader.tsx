import { EmptyRequest } from "@shared/proto/blu/common"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { UiServiceClient } from "@/services/grpc-client"
import BluLogoWhite from "@/assets/BluLogoWhite"
import { version } from "../../../../package.json"

interface HomeHeaderProps {
	shouldShowQuickWins?: boolean
}

const HomeHeader = ({ shouldShowQuickWins = false }: HomeHeaderProps) => {
	const { environment } = useExtensionState()

	const handleTakeATour = async () => {
		try {
			await UiServiceClient.openWalkthrough(EmptyRequest.create())
		} catch (error) {
			console.error("Error opening walkthrough:", error)
		}
	}
	return (
		<div className="flex flex-col items-center mb-5 mt-18">
			
			<div className="absolute top-5 right-12 rounded-md bg-gray-700/40 px-3 py-1 text-xs font-semibold text-gray-300">
				v{version}
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<button type="button" className="hover:opacity-80 transition-opacity">
						<BluLogoWhite className="size-30" />
					</button>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="max-w-xs">
					I can help you develop software by editing files, exploring projects, running commands, and more.
				</TooltipContent>
			</Tooltip>
			<div className="text-center flex items-center justify-center">
				<h1 className="m-0 font-extrabold text-3xl tracking-tight">
					Your Help Starts Here
				</h1>
			</div>
			<div className="mt-6 text-center">
				<h4 className="text-sm text-(--vscode-descriptionForeground)">
					Thank you for choosing Blu — we appreciate your support today and always!
				</h4>
			</div>

			<div>
				<div className="mt-6 text-center">
					<h5 className="text-sm text-(--vscode-descriptionForeground)">
						Look at our <a href="https://github.com/Get-Blu/blu" style={{ textDecoration: 'underline'}}>Blu GitHub Repository</a> for more information.
					</h5>
				</div>
			</div>

			{shouldShowQuickWins && (
				<div className="mt-4">
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-panel bg-white/2 hover:bg-list-background-hover transition-colors duration-150 ease-in-out text-code-foreground text-sm font-medium cursor-pointer"
						onClick={handleTakeATour}
						type="button">
						Take a Tour
						<span className="codicon codicon-play scale-90"></span>
					</button>
				</div>
			)}
		</div>
	)
}

export default HomeHeader
