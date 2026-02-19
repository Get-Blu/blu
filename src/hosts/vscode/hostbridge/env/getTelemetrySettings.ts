import * as vscode from "vscode"
import { EmptyRequest } from "@/shared/proto/index.blu"
import { GetTelemetrySettingsResponse, Setting } from "@/shared/proto/index.host"

export async function getTelemetrySettings(_: EmptyRequest): Promise<GetTelemetrySettingsResponse> {
	if (vscode.env.isTelemetryEnabled) {
		return { isEnabled: Setting.ENABLED }
	} else {
		return { isEnabled: Setting.DISABLED }
	}
}
