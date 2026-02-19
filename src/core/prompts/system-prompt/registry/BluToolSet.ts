import { BLU_MCP_TOOL_IDENTIFIER, McpServer } from "@/shared/mcp"
import { ModelFamily } from "@/shared/prompts"
import { BluDefaultTool } from "@/shared/tools"
import { type BluToolSpec, toolSpecFunctionDeclarations, toolSpecFunctionDefinition, toolSpecInputSchema } from "../spec"
import { PromptVariant, SystemPromptContext } from "../types"

export class BluToolSet {
	// A list of tools mapped by model group
	private static variants: Map<ModelFamily, Set<BluToolSet>> = new Map()

	private constructor(
		public readonly id: string,
		public readonly config: BluToolSpec,
	) {
		this._register()
	}

	public static register(config: BluToolSpec): BluToolSet {
		return new BluToolSet(config.id, config)
	}

	private _register(): void {
		const existingTools = BluToolSet.variants.get(this.config.variant) || new Set()
		if (!Array.from(existingTools).some((t) => t.config.id === this.config.id)) {
			existingTools.add(this)
			BluToolSet.variants.set(this.config.variant, existingTools)
		}
	}

	public static getTools(variant: ModelFamily): BluToolSet[] {
		const toolsSet = BluToolSet.variants.get(variant) || new Set()
		const defaultSet = BluToolSet.variants.get(ModelFamily.GENERIC) || new Set()

		return toolsSet ? Array.from(toolsSet) : Array.from(defaultSet)
	}

	public static getRegisteredModelIds(): string[] {
		return Array.from(BluToolSet.variants.keys())
	}

	public static getToolByName(toolName: string, variant: ModelFamily): BluToolSet | undefined {
		const tools = BluToolSet.getTools(variant)
		return tools.find((tool) => tool.config.id === toolName)
	}

	// Return a tool by name with fallback to GENERIC and then any other variant where it exists
	public static getToolByNameWithFallback(toolName: string, variant: ModelFamily): BluToolSet | undefined {
		// Try exact variant first
		const exact = BluToolSet.getToolByName(toolName, variant)
		if (exact) {
			return exact
		}

		// Fallback to GENERIC
		const generic = BluToolSet.getToolByName(toolName, ModelFamily.GENERIC)
		if (generic) {
			return generic
		}

		// Final fallback: search across all registered variants
		for (const [, tools] of BluToolSet.variants) {
			const found = Array.from(tools).find((t) => t.config.id === toolName)
			if (found) {
				return found
			}
		}

		return undefined
	}

	// Build a list of tools for a variant using requested ids, falling back to GENERIC when missing
	public static getToolsForVariantWithFallback(variant: ModelFamily, requestedIds: string[]): BluToolSet[] {
		const resolved: BluToolSet[] = []
		for (const id of requestedIds) {
			const tool = BluToolSet.getToolByNameWithFallback(id, variant)
			if (tool) {
				// Avoid duplicates by id
				if (!resolved.some((t) => t.config.id === tool.config.id)) {
					resolved.push(tool)
				}
			}
		}
		return resolved
	}

	public static getEnabledTools(variant: PromptVariant, context: SystemPromptContext): BluToolSet[] {
		const resolved: BluToolSet[] = []
		const requestedIds = variant.tools ? [...variant.tools] : []
		for (const id of requestedIds) {
			const tool = BluToolSet.getToolByNameWithFallback(id, variant.family)
			if (tool) {
				// Avoid duplicates by id
				if (!resolved.some((t) => t.config.id === tool.config.id)) {
					resolved.push(tool)
				}
			}
		}

		// Filter by context requirements
		const enabledTools = resolved.filter(
			(tool) => !tool.config.contextRequirements || tool.config.contextRequirements(context),
		)

		return enabledTools
	}

	/**
	 * Get the appropriate native tool converter for the given provider
	 */
	public static getNativeConverter(providerId: string) {
		switch (providerId) {
			case "minimax":
				return toolSpecInputSchema
			case "anthropic":
				return toolSpecInputSchema
			case "gemini":
				return toolSpecFunctionDeclarations
			default:
				return toolSpecFunctionDefinition
		}
	}

	public static getNativeTools(variant: PromptVariant, context: SystemPromptContext) {
		// Only return tool functions if the variant explicitly enables them
		// via the "use_native_tools" label set to 1
		// This avoids exposing tools to models that don't support them
		// or variants that aren't designed for tool use
		if (variant.labels["use_native_tools"] !== 1 || !context.enableNativeToolCalls) {
			return undefined
		}

		// Base set
		const toolsets = BluToolSet.getEnabledTools(variant, context)
		const toolConfigs = toolsets.map((tool) => tool.config)

		// MCP tools
		const mcpServers = context.mcpHub?.getServers()?.filter((s) => s.disabled !== true) || []
		const mcpTools = mcpServers?.flatMap((server) => mcpToolToBluToolSpec(variant.family, server))

		const enabledTools = [...toolConfigs, ...mcpTools]
		const converter = BluToolSet.getNativeConverter(context.providerInfo.providerId)

		return enabledTools.map((tool) => converter(tool, context))
	}
}

/**
 * Convert an MCP server's tools to BluToolSpec format
 */
export function mcpToolToBluToolSpec(family: ModelFamily, server: McpServer): BluToolSpec[] {
	const tools = server.tools || []
	return tools.map((mcpTool) => {
		let parameters: any[] = []

		if (mcpTool.inputSchema && "properties" in mcpTool.inputSchema) {
			const schema = mcpTool.inputSchema as any
			const requiredFields = new Set(schema.required || [])

			parameters = Object.entries(schema.properties as Record<string, any>).map(([name, propSchema]) => {
				// Preserve the full schema, not just basic fields
				const param: any = {
					name,
					instruction: propSchema.description || "",
					type: propSchema.type || "string",
					required: requiredFields.has(name),
				}

				// Preserve items for array types
				if (propSchema.items) {
					param.items = propSchema.items
				}

				// Preserve properties for object types
				if (propSchema.properties) {
					param.properties = propSchema.properties
				}

				// Preserve other JSON Schema fields (enum, format, minimum, maximum, etc.)
				for (const key in propSchema) {
					if (!["type", "description", "items", "properties"].includes(key)) {
						param[key] = propSchema[key]
					}
				}

				return param
			})
		}

		return {
			variant: family,
			id: BluDefaultTool.MCP_USE,
			// We will use the identifier to reconstruct the MCP server and tool name later
			name: server.uid + BLU_MCP_TOOL_IDENTIFIER + mcpTool.name,
			description: `${server.name}: ${mcpTool.description || mcpTool.name}`,
			parameters,
		}
	})
}
