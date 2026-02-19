import Anthropic from "@anthropic-ai/sdk"
import CheckpointTracker from "@integrations/checkpoints/CheckpointTracker"
import getFolderSize from "get-folder-size"
import Mutex from "p-mutex"
import { findLastIndex } from "@/shared/array"
import { combineApiRequests } from "@/shared/combineApiRequests"
import { combineCommandSequences } from "@/shared/combineCommandSequences"
import { BluMessage } from "@/shared/ExtensionMessage"
import { getApiMetrics } from "@/shared/getApiMetrics"
import { HistoryItem } from "@/shared/HistoryItem"
import { getCwd, getDesktopDir } from "@/utils/path"
import { ensureTaskDirectoryExists, saveApiConversationHistory, saveBluMessages } from "../storage/disk"
import { TaskState } from "./TaskState"

interface MessageStateHandlerParams {
	taskId: string
	ulid: string
	taskIsFavorited?: boolean
	updateTaskHistory: (historyItem: HistoryItem) => Promise<HistoryItem[]>
	taskState: TaskState
	checkpointManagerErrorMessage?: string
}

export class MessageStateHandler {
	private apiConversationHistory: Anthropic.MessageParam[] = []
	private bluMessages: BluMessage[] = []
	private taskIsFavorited: boolean
	private checkpointTracker: CheckpointTracker | undefined
	private updateTaskHistory: (historyItem: HistoryItem) => Promise<HistoryItem[]>
	private taskId: string
	private ulid: string
	private taskState: TaskState

	// Mutex to prevent concurrent state modifications (RC-4)
	// Protects against data loss from race conditions when multiple
	// operations try to modify message state simultaneously
	// This follows the same pattern as Task.stateMutex for consistency
	private stateMutex = new Mutex()

	constructor(params: MessageStateHandlerParams) {
		this.taskId = params.taskId
		this.ulid = params.ulid
		this.taskState = params.taskState
		this.taskIsFavorited = params.taskIsFavorited ?? false
		this.updateTaskHistory = params.updateTaskHistory
	}

	setCheckpointTracker(tracker: CheckpointTracker | undefined) {
		this.checkpointTracker = tracker
	}

	/**
	 * Execute function with exclusive lock on message state
	 * Use this for ANY state modification to prevent race conditions
	 * This follows the same pattern as Task.withStateLock for consistency
	 */
	private async withStateLock<T>(fn: () => T | Promise<T>): Promise<T> {
		return await this.stateMutex.withLock(fn)
	}

	getApiConversationHistory(): Anthropic.MessageParam[] {
		return this.apiConversationHistory
	}

	setApiConversationHistory(newHistory: Anthropic.MessageParam[]): void {
		this.apiConversationHistory = newHistory
	}

	getBluMessages(): BluMessage[] {
		return this.bluMessages
	}

	setBluMessages(newMessages: BluMessage[]) {
		this.bluMessages = newMessages
	}

	/**
	 * Internal method to save messages and update history (without mutex protection)
	 * This is used by methods that already hold the stateMutex lock
	 * Should NOT be called directly - use saveBluMessagesAndUpdateHistory() instead
	 */
	private async saveBluMessagesAndUpdateHistoryInternal(): Promise<void> {
		try {
			await saveBluMessages(this.taskId, this.bluMessages)

			// combined as they are in ChatView
			const apiMetrics = getApiMetrics(combineApiRequests(combineCommandSequences(this.bluMessages.slice(1))))
			const taskMessage = this.bluMessages[0] // first message is always the task say
			const lastRelevantMessage =
				this.bluMessages[
					findLastIndex(
						this.bluMessages,
						(message) => !(message.ask === "resume_task" || message.ask === "resume_completed_task"),
					)
				]
			const taskDir = await ensureTaskDirectoryExists(this.taskId)
			let taskDirSize = 0
			try {
				// getFolderSize.loose silently ignores errors
				// returns # of bytes, size/1000/1000 = MB
				taskDirSize = await getFolderSize.loose(taskDir)
			} catch (error) {
				console.error("Failed to get task directory size:", taskDir, error)
			}
			const cwd = await getCwd(getDesktopDir())
			await this.updateTaskHistory({
				id: this.taskId,
				ulid: this.ulid,
				ts: lastRelevantMessage.ts,
				task: taskMessage.text ?? "",
				tokensIn: apiMetrics.totalTokensIn,
				tokensOut: apiMetrics.totalTokensOut,
				cacheWrites: apiMetrics.totalCacheWrites,
				cacheReads: apiMetrics.totalCacheReads,
				totalCost: apiMetrics.totalCost,
				size: taskDirSize,
				shadowGitConfigWorkTree: await this.checkpointTracker?.getShadowGitConfigWorkTree(),
				cwdOnTaskInitialization: cwd,
				conversationHistoryDeletedRange: this.taskState.conversationHistoryDeletedRange,
				isFavorited: this.taskIsFavorited,
				checkpointManagerErrorMessage: this.taskState.checkpointManagerErrorMessage,
			})
		} catch (error) {
			console.error("Failed to save blu messages:", error)
		}
	}

	/**
	 * Save blu messages and update task history (public API with mutex protection)
	 * This is the main entry point for saving message state from external callers
	 */
	async saveBluMessagesAndUpdateHistory(): Promise<void> {
		return await this.withStateLock(async () => {
			await this.saveBluMessagesAndUpdateHistoryInternal()
		})
	}

	async addToApiConversationHistory(message: Anthropic.MessageParam) {
		// Protect with mutex to prevent concurrent modifications from corrupting data (RC-4)
		return await this.withStateLock(async () => {
			this.apiConversationHistory.push(message)
			await saveApiConversationHistory(this.taskId, this.apiConversationHistory)
		})
	}

	async overwriteApiConversationHistory(newHistory: Anthropic.MessageParam[]): Promise<void> {
		// Protect with mutex to prevent concurrent modifications from corrupting data (RC-4)
		return await this.withStateLock(async () => {
			this.apiConversationHistory = newHistory
			await saveApiConversationHistory(this.taskId, this.apiConversationHistory)
		})
	}

	/**
	 * Add a new message to bluMessages array with proper index tracking
	 * CRITICAL: This entire operation must be atomic to prevent race conditions (RC-4)
	 * The conversationHistoryIndex must be set correctly based on the current state,
	 * and the message must be added and saved without any interleaving operations
	 */
	async addToBluMessages(message: BluMessage) {
		return await this.withStateLock(async () => {
			// these values allow us to reconstruct the conversation history at the time this blu message was created
			// it's important that apiConversationHistory is initialized before we add blu messages
			message.conversationHistoryIndex = this.apiConversationHistory.length - 1 // NOTE: this is the index of the last added message which is the user message, and once the blumessages have been presented we update the apiconversationhistory with the completed assistant message. This means when resetting to a message, we need to +1 this index to get the correct assistant message that this tool use corresponds to
			message.conversationHistoryDeletedRange = this.taskState.conversationHistoryDeletedRange
			this.bluMessages.push(message)
			await this.saveBluMessagesAndUpdateHistoryInternal()
		})
	}

	/**
	 * Replace the entire bluMessages array with new messages
	 * Protected by mutex to prevent concurrent modifications (RC-4)
	 */
	async overwriteBluMessages(newMessages: BluMessage[]) {
		return await this.withStateLock(async () => {
			this.bluMessages = newMessages
			await this.saveBluMessagesAndUpdateHistoryInternal()
		})
	}

	/**
	 * Update a specific message in the bluMessages array
	 * The entire operation (validate, update, save) is atomic to prevent races (RC-4)
	 */
	async updateBluMessage(index: number, updates: Partial<BluMessage>): Promise<void> {
		return await this.withStateLock(async () => {
			if (index < 0 || index >= this.bluMessages.length) {
				throw new Error(`Invalid message index: ${index}`)
			}

			// Apply updates to the message
			Object.assign(this.bluMessages[index], updates)

			// Save changes and update history
			await this.saveBluMessagesAndUpdateHistoryInternal()
		})
	}

	/**
	 * Delete a specific message from the bluMessages array
	 * The entire operation (validate, delete, save) is atomic to prevent races (RC-4)
	 */
	async deleteBluMessage(index: number): Promise<void> {
		return await this.withStateLock(async () => {
			if (index < 0 || index >= this.bluMessages.length) {
				throw new Error(`Invalid message index: ${index}`)
			}

			// Remove the message at the specified index
			this.bluMessages.splice(index, 1)

			// Save changes and update history
			await this.saveBluMessagesAndUpdateHistoryInternal()
		})
	}
}
