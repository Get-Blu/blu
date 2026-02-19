import { getFileMentionFromPath } from "@/core/mentions"
import { singleFileDiagnosticsToProblemsString } from "@/integrations/diagnostics"
import { telemetryService } from "@/services/telemetry"
import { CommandContext, Empty } from "@/shared/proto/index.blu"
import { Controller } from "../index"
import { sendAddToInputEvent } from "../ui/subscribeToAddToInput"

export async function addToBlu(controller: Controller, request: CommandContext): Promise<Empty> {
	if (!request.selectedText) {
		return {}
	}

	const filePath = request.filePath || ""
	const fileMention = await getFileMentionFromPath(filePath)

	let input = `${fileMention}\n\`\`\`\n${request.selectedText}\n\`\`\``
	if (request.diagnostics.length) {
		const problemsString = await singleFileDiagnosticsToProblemsString(filePath, request.diagnostics)
		input += `\nProblems:\n${problemsString}`
	}

	await sendAddToInputEvent(input)

	console.log("addToBlu", request.selectedText, filePath, request.language)
	telemetryService.captureButtonClick("codeAction_addToChat", controller.task?.ulid)

	return {}
}
