import type { EmptyRequest } from "@shared/proto/blu/common"
import { Empty } from "@shared/proto/blu/common"
import * as vscode from "vscode"
import { telemetryService } from "@/services/telemetry"
import type { Controller } from "../index"

/**
 * Opens the Blu walkthrough in VSCode
 * @param controller The controller instance
 * @param request Empty request
 * @returns Empty response
 */
export async function openWalkthrough(controller: Controller, _request: EmptyRequest): Promise<Empty> {
	try {
		await vscode.commands.executeCommand(
			"workbench.action.openWalkthrough",
			`${controller.context.extension.id}#BluWalkthrough`,
		)
		telemetryService.captureButtonClick("webview_openWalkthrough")
		return Empty.create({})
	} catch (error) {
		console.error(`Failed to open walkthrough: ${error}`)
		throw error
	}
}
