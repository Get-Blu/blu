import { EmptyRequest } from "@shared/proto/blu/common"
import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { GetHostVersionResponse } from "@/shared/proto/index.host"

export async function getHostVersion(_: EmptyRequest): Promise<GetHostVersionResponse> {
	return {
		platform: vscode.env.appName,
		version: vscode.version,
		bluType: "VSCode Extension",
		bluVersion: ExtensionRegistryInfo.version,
	}
}
