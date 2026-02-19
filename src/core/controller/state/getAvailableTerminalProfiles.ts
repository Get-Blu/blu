import * as proto from "@/shared/proto"
import { getAvailableTerminalProfiles as getTerminalProfilesFromShell } from "../../../utils/shell"
import { Controller } from "../index"

export async function getAvailableTerminalProfiles(
	_controller: Controller,
	_request: proto.blu.EmptyRequest,
): Promise<proto.blu.TerminalProfiles> {
	const profiles = getTerminalProfilesFromShell()

	return proto.blu.TerminalProfiles.create({
		profiles: profiles.map((profile) => ({
			id: profile.id,
			name: profile.name,
			path: profile.path || "",
			description: profile.description || "",
		})),
	})
}
