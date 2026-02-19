import { BluMessage } from "@shared/ExtensionMessage"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { BluError } from "../../../../src/services/error/BluError"

const _errorColor = "var(--vscode-errorForeground)"

interface ErrorRowProps {
	message: BluMessage
	errorType: "error" | "mistake_limit_reached" | "diff_error" | "bluignore_error"
	apiRequestFailedMessage?: string
	apiReqStreamingFailedMessage?: string
}

const ErrorRow = memo(({ message, errorType, apiRequestFailedMessage, apiReqStreamingFailedMessage }: ErrorRowProps) => {


	const renderErrorContent = () => {
		switch (errorType) {
			case "error":
			case "mistake_limit_reached":
				// Handle API request errors with special error parsing
				if (apiRequestFailedMessage || apiReqStreamingFailedMessage) {
					// FIXME: BluError parsing should not be applied to non-Blu providers, but it seems we're using bluErrorMessage below in the default error display
					const bluError = BluError.parse(apiRequestFailedMessage || apiReqStreamingFailedMessage)
					const bluErrorMessage = bluError?.message
					const requestId = bluError?._error?.request_id
					const isBluProvider = bluError?.providerId === "blu" // FIXME: since we are modifying backend to return generic error, we need to make sure we're not expecting providerId here



					if (bluError?.isErrorType(1 as any)) { // BluErrorType.RateLimit might be removed or I keep it as literal if I can't find the enum
						return (
							<p className="m-0 whitespace-pre-wrap text-(--vscode-errorForeground) wrap-anywhere">
								{bluErrorMessage}
								{requestId && <div>Request ID: {requestId}</div>}
							</p>
						)
					}

					// For non-blu providers, we display the raw error message
					const errorMessageToDisplay = isBluProvider
						? bluErrorMessage
						: apiReqStreamingFailedMessage || apiRequestFailedMessage

					// Default error display
					return (
						<p className="m-0 whitespace-pre-wrap text-(--vscode-errorForeground) wrap-anywhere">
							{errorMessageToDisplay}
							{requestId && <div>Request ID: {requestId}</div>}
							{bluErrorMessage?.toLowerCase()?.includes("powershell") && (
								<>
									<br />
									<br />
									It seems like you're having Windows PowerShell issues, please see this{" "}
									<a
										className="underline text-inherit"
										href="https://github.com/GarvAgnihotri/blu/wiki/TroubleShooting-%E2%80%90-%22PowerShell-is-not-recognized-as-an-internal-or-external-command%22">
										troubleshooting guide
									</a>
									.
								</>
							)}

						</p>
					)
				}

				// Regular error message
				return <p className="m-0 whitespace-pre-wrap text-(--vscode-errorForeground) wrap-anywhere">{message.text}</p>

			case "diff_error":
				return (
					<div className="flex flex-col p-2 rounded-lg text-xs opacity-80 bg-(--vscode-textBlockQuote-background) text-(--vscode-foreground)">
						<div>The model used search patterns that don't match anything in the file. Retrying...</div>
					</div>
				)

			case "bluignore_error":
				return (
					<div className="flex flex-col p-2 rounded-lg text-xs bg-(--vscode-textBlockQuote-background) text-(--vscode-foreground) opacity-80">
						<div>
							Blu tried to access <code>{message.text}</code> which is blocked by the <code>.bluignore</code>
							file.
						</div>
					</div>
				)

			default:
				return null
		}
	}

	// For diff_error and bluignore_error, we don't show the header separately
	if (errorType === "diff_error" || errorType === "bluignore_error") {
		return <>{renderErrorContent()}</>
	}

	// For other error types, show header + content
	return <>{renderErrorContent()}</>
})

export default ErrorRow
