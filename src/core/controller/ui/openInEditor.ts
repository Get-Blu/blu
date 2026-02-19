import type { EmptyRequest } from "@shared/proto/blu/common"
import { Empty } from "@shared/proto/blu/common"
import { telemetryService } from "@/services/telemetry"
import { WebviewProvider } from "@core/webview"
import type { Controller } from "../index"

/**
 * Opens in editor as a tab (like a new file opens)
 * @param controller The controller instance
 * @param request Empty request
 * @returns Empty response
 */
export async function openInEditor(_controller: Controller, _request: EmptyRequest): Promise<Empty> {
	try {
		console.log("[DEBUG] openInEditor controller function called")
		const webview = WebviewProvider.getInstance() as any
		console.log("[DEBUG] Webview instance type:", webview?.constructor?.name)
		console.log("[DEBUG] Has openInEditorTab method:", typeof webview?.openInEditorTab)

		// Call method to open in editor tab
		if (typeof webview.openInEditorTab === "function") {
			console.log("[DEBUG] Calling openInEditorTab() from controller...")
			await webview.openInEditorTab()
			console.log("[DEBUG] openInEditorTab() completed from controller")
		} else {
			throw new Error("openInEditorTab method not found. Please update to VSCode extension.")
		}

		telemetryService.captureButtonClick("webview_openInEditor")
		return Empty.create({})
	} catch (error) {
		console.error(`[DEBUG] Failed to open in editor: ${error}`)
		throw error
	}
}
