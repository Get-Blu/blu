import { ModelFamily } from "@/shared/prompts"
import { BluDefaultTool } from "@/shared/tools"
import type { BluToolSpec } from "../spec"

// HACK: Placeholder to act as tool dependency
const generic: BluToolSpec = {
	variant: ModelFamily.GENERIC,
	id: BluDefaultTool.TODO,
	name: "focus_chain",
	description: "",
	contextRequirements: (context) => context.focusChainSettings?.enabled === true,
}

export const focus_chain_variants = [generic]
