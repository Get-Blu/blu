import { BluAsk as AppBluAsk, BluMessage as AppBluMessage, BluSay as AppBluSay } from "@shared/ExtensionMessage"

import { BluAsk, BluMessageType, BluSay, BluMessage as ProtoBluMessage } from "@shared/proto/blu/ui"

// Helper function to convert BluAsk string to enum
function convertBluAskToProtoEnum(ask: AppBluAsk | undefined): BluAsk | undefined {
	if (!ask) {
		return undefined
	}

	const mapping: Record<AppBluAsk, BluAsk> = {
		followup: BluAsk.FOLLOWUP,
		plan_mode_respond: BluAsk.PLAN_MODE_RESPOND,
		command: BluAsk.COMMAND,
		command_output: BluAsk.COMMAND_OUTPUT,
		completion_result: BluAsk.COMPLETION_RESULT,
		tool: BluAsk.TOOL,
		api_req_failed: BluAsk.API_REQ_FAILED,
		resume_task: BluAsk.RESUME_TASK,
		resume_completed_task: BluAsk.RESUME_COMPLETED_TASK,
		mistake_limit_reached: BluAsk.MISTAKE_LIMIT_REACHED,
		browser_action_launch: BluAsk.BROWSER_ACTION_LAUNCH,
		use_mcp_server: BluAsk.USE_MCP_SERVER,
		new_task: BluAsk.NEW_TASK,
		condense: BluAsk.CONDENSE,
		summarize_task: BluAsk.SUMMARIZE_TASK,
		report_bug: BluAsk.REPORT_BUG,
	}

	const result = mapping[ask]
	if (result === undefined) {
		console.warn(`Unknown BluAsk value: ${ask}`)
	}
	return result
}

// Helper function to convert BluAsk enum to string
function convertProtoEnumToBluAsk(ask: BluAsk): AppBluAsk | undefined {
	if (ask === BluAsk.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED BluAsk enum value")
		return undefined
	}

	const mapping: Record<Exclude<BluAsk, BluAsk.UNRECOGNIZED>, AppBluAsk> = {
		[BluAsk.FOLLOWUP]: "followup",
		[BluAsk.PLAN_MODE_RESPOND]: "plan_mode_respond",
		[BluAsk.COMMAND]: "command",
		[BluAsk.COMMAND_OUTPUT]: "command_output",
		[BluAsk.COMPLETION_RESULT]: "completion_result",
		[BluAsk.TOOL]: "tool",
		[BluAsk.API_REQ_FAILED]: "api_req_failed",
		[BluAsk.RESUME_TASK]: "resume_task",
		[BluAsk.RESUME_COMPLETED_TASK]: "resume_completed_task",
		[BluAsk.MISTAKE_LIMIT_REACHED]: "mistake_limit_reached",
		[BluAsk.BROWSER_ACTION_LAUNCH]: "browser_action_launch",
		[BluAsk.USE_MCP_SERVER]: "use_mcp_server",
		[BluAsk.NEW_TASK]: "new_task",
		[BluAsk.CONDENSE]: "condense",
		[BluAsk.SUMMARIZE_TASK]: "summarize_task",
		[BluAsk.REPORT_BUG]: "report_bug",
	}

	return mapping[ask]
}

// Helper function to convert BluSay string to enum
function convertBluSayToProtoEnum(say: AppBluSay | undefined): BluSay | undefined {
	if (!say) {
		return undefined
	}

	const mapping: Record<AppBluSay, BluSay> = {
		task: BluSay.TASK,
		error: BluSay.ERROR,
		api_req_started: BluSay.API_REQ_STARTED,
		api_req_finished: BluSay.API_REQ_FINISHED,
		text: BluSay.TEXT,
		reasoning: BluSay.REASONING,
		completion_result: BluSay.COMPLETION_RESULT_SAY,
		user_feedback: BluSay.USER_FEEDBACK,
		user_feedback_diff: BluSay.USER_FEEDBACK_DIFF,
		api_req_retried: BluSay.API_REQ_RETRIED,
		command: BluSay.COMMAND_SAY,
		command_output: BluSay.COMMAND_OUTPUT_SAY,
		tool: BluSay.TOOL_SAY,
		shell_integration_warning: BluSay.SHELL_INTEGRATION_WARNING,
		shell_integration_warning_with_suggestion: BluSay.SHELL_INTEGRATION_WARNING,
		browser_action_launch: BluSay.BROWSER_ACTION_LAUNCH_SAY,
		browser_action: BluSay.BROWSER_ACTION,
		browser_action_result: BluSay.BROWSER_ACTION_RESULT,
		mcp_server_request_started: BluSay.MCP_SERVER_REQUEST_STARTED,
		mcp_server_response: BluSay.MCP_SERVER_RESPONSE,
		mcp_notification: BluSay.MCP_NOTIFICATION,
		use_mcp_server: BluSay.USE_MCP_SERVER_SAY,
		diff_error: BluSay.DIFF_ERROR,
		deleted_api_reqs: BluSay.DELETED_API_REQS,
		bluignore_error: BluSay.BLU_IGNORE_ERROR,
		checkpoint_created: BluSay.CHECKPOINT_CREATED,
		load_mcp_documentation: BluSay.LOAD_MCP_DOCUMENTATION,
		info: BluSay.INFO,
		task_progress: BluSay.TASK_PROGRESS,
		error_retry: BluSay.ERROR_RETRY,
		hook: BluSay.INFO,
		hook_output: BluSay.COMMAND_OUTPUT_SAY,
	}

	const result = mapping[say]
	if (result === undefined) {
		console.warn(`Unknown BluSay value: ${say}`)
	}
	return result
}

// Helper function to convert BluSay enum to string
function convertProtoEnumToBluSay(say: BluSay): AppBluSay | undefined {
	if (say === BluSay.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED BluSay enum value")
		return undefined
	}

	const mapping: Record<Exclude<BluSay, BluSay.UNRECOGNIZED>, AppBluSay> = {
		[BluSay.TASK]: "task",
		[BluSay.ERROR]: "error",
		[BluSay.API_REQ_STARTED]: "api_req_started",
		[BluSay.API_REQ_FINISHED]: "api_req_finished",
		[BluSay.TEXT]: "text",
		[BluSay.REASONING]: "reasoning",
		[BluSay.COMPLETION_RESULT_SAY]: "completion_result",
		[BluSay.USER_FEEDBACK]: "user_feedback",
		[BluSay.USER_FEEDBACK_DIFF]: "user_feedback_diff",
		[BluSay.API_REQ_RETRIED]: "api_req_retried",
		[BluSay.COMMAND_SAY]: "command",
		[BluSay.COMMAND_OUTPUT_SAY]: "command_output",
		[BluSay.TOOL_SAY]: "tool",
		[BluSay.SHELL_INTEGRATION_WARNING]: "shell_integration_warning",
		[BluSay.BROWSER_ACTION_LAUNCH_SAY]: "browser_action_launch",
		[BluSay.BROWSER_ACTION]: "browser_action",
		[BluSay.BROWSER_ACTION_RESULT]: "browser_action_result",
		[BluSay.MCP_SERVER_REQUEST_STARTED]: "mcp_server_request_started",
		[BluSay.MCP_SERVER_RESPONSE]: "mcp_server_response",
		[BluSay.MCP_NOTIFICATION]: "mcp_notification",
		[BluSay.USE_MCP_SERVER_SAY]: "use_mcp_server",
		[BluSay.DIFF_ERROR]: "diff_error",
		[BluSay.DELETED_API_REQS]: "deleted_api_reqs",
		[BluSay.BLU_IGNORE_ERROR]: "bluignore_error",
		[BluSay.CHECKPOINT_CREATED]: "checkpoint_created",
		[BluSay.LOAD_MCP_DOCUMENTATION]: "load_mcp_documentation",
		[BluSay.INFO]: "info",
		[BluSay.TASK_PROGRESS]: "task_progress",
		[BluSay.ERROR_RETRY]: "error_retry",
	}

	return mapping[say]
}

/**
 * Convert application BluMessage to proto BluMessage
 */
export function convertBluMessageToProto(message: AppBluMessage): ProtoBluMessage {
	// For sending messages, we need to provide values for required proto fields
	const askEnum = message.ask ? convertBluAskToProtoEnum(message.ask) : undefined
	const sayEnum = message.say ? convertBluSayToProtoEnum(message.say) : undefined

	// Determine appropriate enum values based on message type
	let finalAskEnum: BluAsk = BluAsk.FOLLOWUP // Proto default
	let finalSayEnum: BluSay = BluSay.TEXT // Proto default

	if (message.type === "ask") {
		finalAskEnum = askEnum ?? BluAsk.FOLLOWUP // Use FOLLOWUP as default for ask messages
	} else if (message.type === "say") {
		finalSayEnum = sayEnum ?? BluSay.TEXT // Use TEXT as default for say messages
	}

	const protoMessage: ProtoBluMessage = {
		ts: message.ts,
		type: message.type === "ask" ? BluMessageType.ASK : BluMessageType.SAY,
		ask: finalAskEnum,
		say: finalSayEnum,
		text: message.text ?? "",
		reasoning: message.reasoning ?? "",
		images: message.images ?? [],
		files: message.files ?? [],
		partial: message.partial ?? false,
		lastCheckpointHash: message.lastCheckpointHash ?? "",
		isCheckpointCheckedOut: message.isCheckpointCheckedOut ?? false,
		isOperationOutsideWorkspace: message.isOperationOutsideWorkspace ?? false,
		conversationHistoryIndex: message.conversationHistoryIndex ?? 0,
		conversationHistoryDeletedRange: message.conversationHistoryDeletedRange
			? {
					startIndex: message.conversationHistoryDeletedRange[0],
					endIndex: message.conversationHistoryDeletedRange[1],
				}
			: undefined,
		// Additional optional fields for specific ask/say types
		sayTool: undefined,
		sayBrowserAction: undefined,
		browserActionResult: undefined,
		askUseMcpServer: undefined,
		planModeResponse: undefined,
		askQuestion: undefined,
		askNewTask: undefined,
		apiReqInfo: undefined,
	}

	return protoMessage
}

/**
 * Convert proto BluMessage to application BluMessage
 */
export function convertProtoToBluMessage(protoMessage: ProtoBluMessage): AppBluMessage {
	const message: AppBluMessage = {
		ts: protoMessage.ts,
		type: protoMessage.type === BluMessageType.ASK ? "ask" : "say",
	}

	// Convert ask enum to string
	if (protoMessage.type === BluMessageType.ASK) {
		const ask = convertProtoEnumToBluAsk(protoMessage.ask)
		if (ask !== undefined) {
			message.ask = ask
		}
	}

	// Convert say enum to string
	if (protoMessage.type === BluMessageType.SAY) {
		const say = convertProtoEnumToBluSay(protoMessage.say)
		if (say !== undefined) {
			message.say = say
		}
	}

	// Convert other fields - preserve empty strings as they may be intentional
	if (protoMessage.text !== "") {
		message.text = protoMessage.text
	}
	if (protoMessage.reasoning !== "") {
		message.reasoning = protoMessage.reasoning
	}
	if (protoMessage.images.length > 0) {
		message.images = protoMessage.images
	}
	if (protoMessage.files.length > 0) {
		message.files = protoMessage.files
	}
	if (protoMessage.partial) {
		message.partial = protoMessage.partial
	}
	if (protoMessage.lastCheckpointHash !== "") {
		message.lastCheckpointHash = protoMessage.lastCheckpointHash
	}
	if (protoMessage.isCheckpointCheckedOut) {
		message.isCheckpointCheckedOut = protoMessage.isCheckpointCheckedOut
	}
	if (protoMessage.isOperationOutsideWorkspace) {
		message.isOperationOutsideWorkspace = protoMessage.isOperationOutsideWorkspace
	}
	if (protoMessage.conversationHistoryIndex !== 0) {
		message.conversationHistoryIndex = protoMessage.conversationHistoryIndex
	}

	// Convert conversationHistoryDeletedRange from object to tuple
	if (protoMessage.conversationHistoryDeletedRange) {
		message.conversationHistoryDeletedRange = [
			protoMessage.conversationHistoryDeletedRange.startIndex,
			protoMessage.conversationHistoryDeletedRange.endIndex,
		]
	}

	return message
}
