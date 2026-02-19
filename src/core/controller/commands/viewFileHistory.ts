import { HostProvider } from "@/hosts/host-provider"
import { ShowMessageType } from "@/shared/proto/host/window"
import { getCwd } from "@/utils/path"
import { checkGitInstalled, checkGitRepo, checkGitRepoHasCommits } from "@/utils/git"

interface GitFileCommit {
	hash: string
	shortHash: string
	subject: string
	author: string
	date: string
}

export async function viewFileHistory() {
	const activeEditor = await HostProvider.window.getActiveEditor({})
	if (!activeEditor.filePath) {
		HostProvider.window.showMessage({
			type: ShowMessageType.ERROR,
			message: "No file is currently open",
		})
		return
	}

	const filePath = activeEditor.filePath
	const fileName = filePath.split(/[/\\]/).pop() || "file"

	try {
		const cwd = await getCwd()
		if (!cwd) {
			HostProvider.window.showMessage({
				type: ShowMessageType.ERROR,
				message: "No workspace folder open",
			})
			return
		}

		const isGitInstalled = await checkGitInstalled()
		if (!isGitInstalled) {
			HostProvider.window.showMessage({
				type: ShowMessageType.ERROR,
				message: "Git is not installed on your system. Please install Git to view file history.",
			})
			return
		}

		const isRepo = await checkGitRepo(cwd)
		if (!isRepo) {
			HostProvider.window.showMessage({
				type: ShowMessageType.ERROR,
				message: "Not a Git repository. Please initialize Git in this folder.",
			})
			return
		}

		const hasCommits = await checkGitRepoHasCommits(cwd)
		if (!hasCommits) {
			HostProvider.window.showMessage({
				type: ShowMessageType.INFORMATION,
				message: "No commits found in this repository yet.",
			})
			return
		}

		const commits = await getFileHistory(filePath, cwd)
		if (commits.length === 0) {
			HostProvider.window.showMessage({
				type: ShowMessageType.INFORMATION,
				message: `No commit history found for ${fileName}`,
			})
			return
		}

		const commitOptions = commits.map(
			(commit) => `${commit.shortHash} - ${commit.subject} (${commit.author}, ${commit.date})`,
		)

		const selected = await HostProvider.window.showMessage({
			type: ShowMessageType.INFORMATION,
			message: `Select a commit to view changes for ${fileName}:`,
			options: {
				items: commitOptions,
				modal: true,
			},
		})

		if (selected.selectedOption) {
			const selectedIndex = commitOptions.indexOf(selected.selectedOption)
			if (selectedIndex !== -1) {
				await showFileDiff(filePath, commits[selectedIndex].hash, fileName, cwd)
			}
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		HostProvider.window.showMessage({
			type: ShowMessageType.ERROR,
			message: `Failed to view file history: ${errorMessage}`,
		})
	}
}

async function getFileHistory(filePath: string, cwd: string): Promise<GitFileCommit[]> {
	const { exec } = require("child_process")
	const { promisify } = require("util")
	const execAsync = promisify(exec)

	try {
		const { stdout } = await execAsync(`git log --follow --format="%H%n%h%n%s%n%an%n%ad" --date=short -50 -- "${filePath}"`, {
			cwd,
		})

		const commits: GitFileCommit[] = []
		const lines = stdout.trim().split("\n")

		for (let i = 0; i < lines.length; i += 5) {
			if (i + 4 < lines.length) {
				commits.push({
					hash: lines[i],
					shortHash: lines[i + 1],
					subject: lines[i + 2],
					author: lines[i + 3],
					date: lines[i + 4],
				})
			}
		}

		return commits
	} catch (error) {
		console.error("Error getting file history:", error)
		return []
	}
}

async function showFileDiff(filePath: string, commitHash: string, fileName: string, cwd: string) {
	const { exec } = require("child_process")
	const { promisify } = require("util")
	const fs = require("fs")
	const path = require("path")
	const os = require("os")
	const execAsync = promisify(exec)

	try {
		const { stdout: commitInfo } = await execAsync(`git show ${commitHash} --format="%h%n%s%n%an%n%ad" --no-patch`, { cwd })
		const { stdout: diff } = await execAsync(`git diff ${commitHash}^ ${commitHash} -- "${filePath}"`, { cwd })

		if (!diff.trim()) {
			HostProvider.window.showMessage({
				type: ShowMessageType.INFORMATION,
				message: "No changes found in this commit for this file",
			})
			return
		}

		const content = `Commit: ${commitHash.substring(0, 7)}
${commitInfo}

Changes in ${fileName}:

${diff}`

		const tempDir = os.tmpdir()
		const tempFileName = `.diff-${commitHash.substring(0, 7)}.diff`
		const tempFilePath = path.join(tempDir, tempFileName)

		fs.writeFileSync(tempFilePath, content, "utf8")

		await HostProvider.window.showTextDocument({
			path: tempFilePath,
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		HostProvider.window.showMessage({
			type: ShowMessageType.ERROR,
			message: `Failed to show file diff: ${errorMessage}`,
		})
	}
}
