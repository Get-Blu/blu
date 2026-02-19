import { sendDidBecomeVisibleEvent } from "@core/controller/ui/subscribeToDidBecomeVisible"
import { WebviewProvider } from "@core/webview"
import { getNonce } from "@core/webview/getNonce"
import { readFile } from "fs/promises"
import * as vscode from "vscode"
import { handleGrpcRequest, handleGrpcRequestCancel } from "@/core/controller/grpc-handler"
import { HostProvider } from "@/hosts/host-provider"
import { ExtensionRegistryInfo } from "@/registry"
import type { ExtensionMessage } from "@/shared/ExtensionMessage"
import { WebviewMessage } from "@/shared/WebviewMessage"

/*
https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts
https://github.com/KumarVariable/vscode-extension-sidebar-html/blob/master/src/customSidebarViewProvider.ts
*/

export class VscodeWebviewProvider extends WebviewProvider implements vscode.WebviewViewProvider {
	// Used in package.json as view's id. This value cannot be changed due to how vscode caches
	// views based on their id, and updating the id would break existing instances of the extension.
	public static readonly SIDEBAR_ID = ExtensionRegistryInfo.views.Sidebar

	private webview?: vscode.WebviewView
	private disposables: vscode.Disposable[] = []
	private editorPanel?: vscode.WebviewPanel

	override getWebviewUrl(path: string) {
		if (!this.webview) {
			throw new Error("Webview not initialized")
		}
		const uri = this.webview.webview.asWebviewUri(vscode.Uri.file(path))
		return uri.toString()
	}

	override getCspSource() {
		if (!this.webview) {
			throw new Error("Webview not initialized")
		}
		return this.webview.webview.cspSource
	}

	override isVisible() {
		return this.webview?.visible || this.editorPanel?.visible || false
	}

	public getWebview(): vscode.WebviewView | undefined {
		return this.webview
	}

	/**
	 * Initializes and sets up the webview when it's first created.
	 *
	 * @param webviewView - The sidebar webview view instance to be resolved
	 * @returns A promise that resolves when the webview has been fully initialized
	 */
	public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
		this.webview = webviewView

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(HostProvider.get().extensionFsPath)],
		}

		// Sets up an event listener to listen for messages passed from the webview view context
		// and executes code based on the message that is received
		this.setWebviewMessageListener(webviewView.webview)

		webviewView.webview.html =
			this.context.extensionMode === vscode.ExtensionMode.Development
				? await this.getHMRHtmlContent()
				: this.getHtmlContent()

		// Logs show up in bottom panel > Debug Console
		//console.log("registering listener")

		// Listen for when the sidebar becomes visible
		// https://github.com/microsoft/vscode-discussions/discussions/840

		// onDidChangeVisibility is only available on the sidebar webview
		// Otherwise WebviewView and WebviewPanel have all the same properties except for this visibility listener
		// WebviewPanel is not currently used in the extension
		webviewView.onDidChangeVisibility(
			async () => {
				if (this.webview?.visible) {
					await sendDidBecomeVisibleEvent()
				}
			},
			null,
			this.disposables,
		)

		// Listen for when the view is disposed
		// This happens when the user closes the view or when the view is closed programmatically
		webviewView.onDidDispose(
			async () => {
				await this.dispose()
			},
			null,
			this.disposables,
		)

		// Listen for configuration changes
		vscode.workspace.onDidChangeConfiguration(
			async (e) => {
				if (e && e.affectsConfiguration("blu.mcpMarketplace.enabled")) {
					// Update state when marketplace tab setting changes
					await this.controller.postStateToWebview()
				}
			},
			null,
			this.disposables,
		)

		// if the extension is starting a new session, clear previous task state
		this.controller.clearTask()

		HostProvider.get().logToChannel("Webview view resolved")

		// Title setting logic removed to allow VSCode to use the container title primarily.
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * IMPORTANT: When passing methods as callbacks in JavaScript/TypeScript, the method's
	 * 'this' context can be lost. This happens because the method is passed as a
	 * standalone function reference, detached from its original object.
	 *
	 * The Problem:
	 * Doing: webview.onDidReceiveMessage(this.controller.handleWebviewMessage)
	 * Would cause 'this' inside handleWebviewMessage to be undefined or wrong,
	 * leading to "TypeError: this.setUserInfo is not a function"
	 *
	 * The Solution:
	 * We wrap the method call in an arrow function, which:
	 * 1. Preserves the lexical scope's 'this' binding
	 * 2. Ensures handleWebviewMessage is called as a method on the controller instance
	 * 3. Maintains access to all controller methods and properties
	 *
	 * Alternative solutions could use .bind() or making handleWebviewMessage an arrow
	 * function property, but this approach is clean and explicit.
	 *
	 * @param webview The webview instance to attach the message listener to
	 */
	private setWebviewMessageListener(webview: vscode.Webview) {
		webview.onDidReceiveMessage(
			(message) => {
				this.handleWebviewMessage(message)
			},
			null,
			this.disposables,
		)
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	async handleWebviewMessage(message: WebviewMessage) {
		const postMessageToWebview = (response: ExtensionMessage) => this.postMessageToWebview(response)

		switch (message.type) {
			case "grpc_request": {
				if (message.grpc_request) {
					await handleGrpcRequest(this.controller, postMessageToWebview, message.grpc_request)
				}
				break
			}
			case "grpc_request_cancel": {
				if (message.grpc_request_cancel) {
					await handleGrpcRequestCancel(postMessageToWebview, message.grpc_request_cancel)
				}
				break
			}
			default: {
				console.error("Received unhandled WebviewMessage type:", JSON.stringify(message))
			}
		}
	}

	/**
	 * Sends a message from the extension to the webview.
	 *
	 * @param message - The message to send to the webview
	 * @returns A thenable that resolves to a boolean indicating success, or undefined if the webview is not available
	 */
	private async postMessageToWebview(message: ExtensionMessage): Promise<boolean | undefined> {
		const sidebarResult = await this.webview?.webview.postMessage(message)
		if (this.editorPanel) {
			await this.editorPanel.webview.postMessage(message)
		}
		return sidebarResult
	}

	override async dispose() {
		// WebviewView doesn't have a dispose method, it's managed by VSCode
		// We just need to clean up our disposables
		while (this.disposables.length) {
			const x = this.disposables.pop()
			if (x) {
				x.dispose()
			}
		}
		super.dispose()
	}

	/**
	 * Opens the webview in an editor tab (like a new file opens)
	 */
	public async openInEditorTab(): Promise<void> {
		console.log("[DEBUG] openInEditorTab() called")
		try {
			// If panel already exists, just reveal it
			if (this.editorPanel) {
				console.log("[DEBUG] Editor panel already exists, revealing it")
				this.editorPanel.reveal()
				return
			}

			// Get last visible text editor column to determine where to place new tab
			const lastCol = Math.max(...vscode.window.visibleTextEditors.map((editor) => editor.viewColumn || 0))
			console.log("[DEBUG] Last visible column:", lastCol)

			// Check if there are any visible text editors, otherwise open a new group
			const hasVisibleEditors = vscode.window.visibleTextEditors.length > 0
			console.log("[DEBUG] Has visible editors:", hasVisibleEditors)

			if (!hasVisibleEditors) {
				console.log("[DEBUG] Creating new editor group")
				vscode.commands.executeCommand("workbench.action.newGroupRight")
			}

			const targetCol = hasVisibleEditors ? Math.max(lastCol + 1, 1) : vscode.ViewColumn.Two
			console.log("[DEBUG] Target column:", targetCol)

			// Create a new webview panel (tab in editor area)
			console.log("[DEBUG] Creating webview panel...")
			this.editorPanel = vscode.window.createWebviewPanel("blu.editorPanel", "Blu", targetCol, {
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [vscode.Uri.file(HostProvider.get().extensionFsPath)],
			})
			console.log("[DEBUG] Webview panel created:", this.editorPanel ? "SUCCESS" : "FAILED")

			// Set up webview panel
			this.editorPanel.iconPath = {
				light: vscode.Uri.joinPath(this.context.extensionUri, "assets", "icons", "icon.png"),
				dark: vscode.Uri.joinPath(this.context.extensionUri, "assets", "icons", "icon.png"),
			}

			// Set up message listener for panel
			this.editorPanel.webview.onDidReceiveMessage(
				(message) => {
					console.log("[DEBUG] Message received in editor panel:", message)
					this.handleWebviewMessage(message as WebviewMessage)
				},
				null,
				this.disposables,
			)

			// Set HTML content (reuse existing HTML generation logic)
			console.log("[DEBUG] Setting HTML content...")
			this.editorPanel.webview.html =
				this.context.extensionMode === vscode.ExtensionMode.Development
					? await this.getHMRHtmlContentForPanel(this.editorPanel.webview)
					: this.getHtmlContentForPanel(this.editorPanel.webview)
			console.log("[DEBUG] HTML content set")

			// Handle panel visibility changes
			this.editorPanel.onDidChangeViewState(
				(e) => {
					console.log("[DEBUG] Editor panel visibility changed:", e.webviewPanel.visible)
					if (e.webviewPanel.visible) {
						e.webviewPanel.webview.postMessage({ type: "action", action: "didBecomeVisible" })
					}
				},
				null,
				this.disposables,
			)

			// Handle panel disposal
			this.editorPanel.onDidDispose(
				() => {
					console.log("[DEBUG] Editor panel disposed")
					this.editorPanel = undefined
				},
				null,
				this.disposables,
			)

			// Lock editor group so clicking on files doesn't open them over the panel
			setTimeout(() => {
				console.log("[DEBUG] Locking editor group")
				vscode.commands.executeCommand("workbench.action.lockEditorGroup")
			}, 100)
		} catch (error) {
			console.error("[DEBUG] Failed to open in editor tab:", error)
		}
	}

	/**
	 * Generates HTML content for panel (similar to getHtmlContent but for a specific webview)
	 */
	private getHtmlContentForPanel(webview: vscode.Webview): string {
		const scriptUrl = this.getWebviewUrlForPanel(webview, "webview-ui", "build", "assets", "index.js")
		const stylesUrl = this.getWebviewUrlForPanel(webview, "webview-ui", "build", "assets", "index.css")
		const codiconsUrl = this.getWebviewUrlForPanel(webview, "node_modules", "@vscode", "codicons", "dist", "codicon.css")
		const nonce = getNonce()
		const cspSource = webview.cspSource

		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta name="theme-color" content="#000000">
					<link rel="stylesheet" type="text/css" href="${stylesUrl}">
					<link href="${codiconsUrl}" rel="stylesheet" />
					<meta http-equiv="Content-Security-Policy" content="default-src 'none';
						connect-src https://*.posthog.com https://*.getblu.in https://*.firebaseauth.com https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com; 
						font-src ${cspSource} data:; 
						style-src ${cspSource} 'unsafe-inline'; 
						img-src ${cspSource} https: data:; 
						script-src 'nonce-${nonce}' 'unsafe-eval';">
					<title>Blu</title>
				</head>
				<body>
					<noscript>You need to enable JavaScript to run this app.</noscript>
					<div id="root"></div>
					<script type="module" nonce="${nonce}" src="${scriptUrl}"></script> 
				</body>
			</html>
		`
	}

	/**
	 * Generates HMR HTML content for panel (similar to getHMRHtmlContent but for a specific webview)
	 */
	private async getHMRHtmlContentForPanel(webview: vscode.Webview): Promise<string> {
		const path = require("path")
		const axios = require("axios").default
		const DEFAULT_PORT = 25463
		const portFilePath = path.join(this.context.extensionUri.fsPath, "webview-ui", ".vite-port")

		let localPort = DEFAULT_PORT
		try {
			const portFile = await readFile(portFilePath, "utf8")
			localPort = parseInt(portFile.trim()) || DEFAULT_PORT
		} catch (_err) {
			console.warn(`Port file not found, using default port: ${DEFAULT_PORT}`)
		}

		const localServerUrl = `localhost:${localPort}`

		// Check if local dev server is running
		try {
			await axios.get(`http://${localServerUrl}`)
		} catch (_error) {
			// Dev server not running, fall back to bundled assets
			console.log("[DEBUG] Dev server not running, using bundled assets for editor panel")
			return this.getHtmlContentForPanel(webview)
		}

		const stylesUrl = this.getWebviewUrlForPanel(webview, "webview-ui", "build", "assets", "index.css")
		const codiconsUrl = this.getWebviewUrlForPanel(webview, "node_modules", "@vscode", "codicons", "dist", "codicon.css")
		const nonce = getNonce()
		const scriptUrl = `http://localhost:${localPort}/src/main.tsx`
		const cspSource = webview.cspSource

		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					${process.env.IS_DEV ? '<script src="http://localhost:8097"></script>' : ""}
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta http-equiv="Content-Security-Policy" content="default-src 'none';
						font-src ${cspSource};
						style-src ${cspSource} 'unsafe-inline' https://* http://localhost:${localPort} http://0.0.0.0:${localPort};
						img-src ${cspSource} https: data:;
						script-src 'unsafe-eval' https://* http://localhost:${localPort} http://0.0.0.0:${localPort} 'nonce-${nonce}';
						connect-src https://* ws://localhost:${localPort} ws://0.0.0.0:${localPort} http://localhost:${localPort} http://0.0.0.0:${localPort};">
					<link rel="stylesheet" type="text/css" href="${stylesUrl}">
					<link href="${codiconsUrl}" rel="stylesheet" />
					<title>Blu</title>
				</head>
				<body>
					<div id="root"></div>
					<script nonce="${nonce}" type="module">
						import RefreshRuntime from "http://localhost:${localPort}/@react-refresh"
						RefreshRuntime.injectIntoGlobalHook(window)
						window.$RefreshReg$ = () => {}
						window.$RefreshSig$ = () => (type) => type
						window.__vite_plugin_react_preamble_installed__ = true
					</script>
					<script type="module" src="${scriptUrl}"></script>
				</body>
			</html>
		`
	}

	/**
	 * Gets webview URL for panel (similar to getWebviewUrl but for a specific webview)
	 */
	private getWebviewUrlForPanel(webview: vscode.Webview, ...pathList: string[]): string {
		const path = require("path").resolve(HostProvider.get().extensionFsPath, ...pathList)
		return webview.asWebviewUri(vscode.Uri.file(path)).toString()
	}
}
