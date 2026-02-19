import { HostProvider } from "@/hosts/host-provider"
import { ShowMessageType } from "@/shared/proto/host/window"
import { getGitRemoteUrls } from "@/utils/git"
import { openUrlInBrowser } from "@/utils/github-url-utils"
import { getCwd } from "@/utils/path"

export async function openGitHubRepo() {
	const cwd = await getCwd()
	if (!cwd) {
		HostProvider.window.showMessage({
			type: ShowMessageType.ERROR,
			message: "No workspace folder open",
		})
		return
	}

	try {
		const remotes = await getGitRemoteUrls(cwd)
		if (remotes.length === 0) {
			HostProvider.window.showMessage({
				type: ShowMessageType.ERROR,
				message: "No Git remotes found in this repository",
			})
			return
		}

		let githubUrl: string | null = null

		for (const remote of remotes) {
			const urlMatch = remote.match(/^([^\s]+):\s+(.+)$/)
			if (!urlMatch) {
				continue
			}

			const [_, _name, url] = urlMatch

			if (!url.includes("github.com")) {
				continue
			}

			if (url.startsWith("git@github.com:")) {
				const repoPath = url.replace("git@github.com:", "").replace(".git", "")
				githubUrl = `https://github.com/${repoPath}`
				break
			} else if (url.startsWith("https://github.com/") || url.startsWith("http://github.com/")) {
				githubUrl = url.replace(".git", "")
				break
			}
		}

		if (!githubUrl) {
			HostProvider.window.showMessage({
				type: ShowMessageType.ERROR,
				message: "No GitHub remote found in this repository",
			})
			return
		}

		await openUrlInBrowser(githubUrl)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		HostProvider.window.showMessage({
			type: ShowMessageType.ERROR,
			message: `Failed to open GitHub repository: ${errorMessage}`,
		})
	}
}
