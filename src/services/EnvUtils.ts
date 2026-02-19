import { isMultiRootWorkspace } from "@/core/workspace/utils/workspace-detection"
import { HostProvider } from "@/hosts/host-provider"
import { ExtensionRegistryInfo } from "@/registry"
import { EmptyRequest } from "@/shared/proto/blu/common"

// Canonical header names for extra client/host context
export const BluHeaders = {
	PLATFORM: "X-PLATFORM",
	PLATFORM_VERSION: "X-PLATFORM-VERSION",
	CLIENT_VERSION: "X-CLIENT-VERSION",
	CLIENT_TYPE: "X-CLIENT-TYPE",
	CORE_VERSION: "X-CORE-VERSION",
	IS_MULTIROOT: "X-IS-MULTIROOT",
} as const
export type BluHeaderName = (typeof BluHeaders)[keyof typeof BluHeaders]

export async function buildBluExtraHeaders(): Promise<Record<string, string>> {
	const headers: Record<string, string> = {}
	try {
		const host = await HostProvider.env.getHostVersion(EmptyRequest.create({}))
		headers[BluHeaders.PLATFORM] = host.platform || "unknown"
		headers[BluHeaders.PLATFORM_VERSION] = host.version || "unknown"
		headers[BluHeaders.CLIENT_TYPE] = host.bluType || "unknown"
		headers[BluHeaders.CLIENT_VERSION] = host.bluVersion || "unknown"
	} catch (error) {
		console.log("Failed to get IDE/platform info via HostBridge EnvService.getHostVersion", error)
		headers[BluHeaders.PLATFORM] = "unknown"
		headers[BluHeaders.PLATFORM_VERSION] = "unknown"
		headers[BluHeaders.CLIENT_TYPE] = "unknown"
		headers[BluHeaders.CLIENT_VERSION] = "unknown"
	}
	headers[BluHeaders.CORE_VERSION] = ExtensionRegistryInfo.version

	try {
		const isMultiRoot = await isMultiRootWorkspace()
		headers[BluHeaders.IS_MULTIROOT] = isMultiRoot ? "true" : "false"
	} catch (error) {
		console.log("Failed to detect multi-root workspace", error)
		headers[BluHeaders.IS_MULTIROOT] = "false"
	}

	return headers
}
