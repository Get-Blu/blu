import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { OpenbluSidebarPanelRequest, OpenbluSidebarPanelResponse } from "@/shared/proto/index.host"

export async function openbluSidebarPanel(_: OpenbluSidebarPanelRequest): Promise<OpenbluSidebarPanelResponse> {
	await vscode.commands.executeCommand(`${ExtensionRegistryInfo.views.Sidebar}.focus`)
	return {}
}
