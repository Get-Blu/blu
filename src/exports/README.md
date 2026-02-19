# Blu API

The Blu extension exposes an API that can be used by other extensions. To use this API in your extension:

1. Copy `src/extension-api/blu.d.ts` to your extension's source directory.
2. Include `blu.d.ts` in your extension's compilation.
3. Get access to the API with the following code:

    ```ts
    	const bluExtension = vscode.extensions.getExtension<BluAPI>("saoudrizwan.claude-dev")

    	if (!bluExtension?.isActive) {
     	throw new Error("Blu extension is not activated")
     }

    const blu = bluExtension.exports

    if (blu) {
    	// Now you can use the API

    	// Start a new task with an initial message
     	await blu.startNewTask("Hello, Blu! Let's make a new project...")

    	// Start a new task with an initial message and images
    	await blu.startNewTask("Use this design language", ["data:image/webp;base64,..."])

    	// Send a message to the current task
    	await blu.sendMessage("Can you fix the @problems?")

    	// Simulate pressing the primary button in the chat interface (e.g. 'Save' or 'Proceed While Running')
    	await blu.pressPrimaryButton()

    	// Simulate pressing the secondary button in the chat interface (e.g. 'Reject')
    	await blu.pressSecondaryButton()
    } else {
     	console.error("Blu API is not available")
    }
    ```

    **Note:** To ensure that the `saoudrizwan.claude-dev` extension is activated before your extension, add it to the `extensionDependencies` in your `package.json`:

    ```json
    "extensionDependencies": [
        "saoudrizwan.claude-dev"
    ]
    ```

For detailed information on the available methods and their usage, refer to the `blu.d.ts` file.
