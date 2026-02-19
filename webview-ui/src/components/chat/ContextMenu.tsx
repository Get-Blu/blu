import React, { useEffect, useMemo, useRef, useState } from "react"
import { cleanPathPrefix } from "@/components/common/CodeAccordian"
import { ContextMenuOptionType, ContextMenuQueryItem, getContextMenuOptions, SearchResult } from "@/utils/context-mentions"

interface ContextMenuProps {
	onSelect: (type: ContextMenuOptionType, value?: string) => void
	searchQuery: string
	onMouseDown: () => void
	selectedIndex: number
	setSelectedIndex: (index: number) => void
	selectedType: ContextMenuOptionType | null
	queryItems: ContextMenuQueryItem[]
	dynamicSearchResults?: SearchResult[]
	isLoading?: boolean
}

const ContextMenu: React.FC<ContextMenuProps> = ({
	onSelect,
	searchQuery,
	onMouseDown,
	selectedIndex,
	setSelectedIndex,
	selectedType,
	queryItems,
	dynamicSearchResults = [],
	isLoading = false,
}) => {
	const menuRef = useRef<HTMLDivElement>(null)

	// State to show delayed loading indicator
	const [showDelayedLoading, setShowDelayedLoading] = useState(false)
	const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const filteredOptions = useMemo(() => {
		const options = getContextMenuOptions(searchQuery, selectedType, queryItems, dynamicSearchResults)
		return options
	}, [searchQuery, selectedType, queryItems, dynamicSearchResults])

	// Effect to handle delayed loading indicator (show "Searching..." after 500ms of searching)
	useEffect(() => {
		if (loadingTimeoutRef.current) {
			clearTimeout(loadingTimeoutRef.current)
			loadingTimeoutRef.current = null
		}

		if (isLoading && searchQuery) {
			setShowDelayedLoading(false)
			loadingTimeoutRef.current = setTimeout(() => {
				if (isLoading) {
					setShowDelayedLoading(true)
				}
			}, 500) // 500ms delay before showing "Searching..."
		} else {
			setShowDelayedLoading(false)
		}

		// Cleanup timeout on unmount or when dependencies change
		return () => {
			if (loadingTimeoutRef.current) {
				clearTimeout(loadingTimeoutRef.current)
				loadingTimeoutRef.current = null
			}
		}
	}, [isLoading, searchQuery])

	useEffect(() => {
		if (menuRef.current) {
			const selectedElement = menuRef.current.children[selectedIndex] as HTMLElement
			if (selectedElement) {
				const menuRect = menuRef.current.getBoundingClientRect()
				const selectedRect = selectedElement.getBoundingClientRect()

				if (selectedRect.bottom > menuRect.bottom) {
					menuRef.current.scrollTop += selectedRect.bottom - menuRect.bottom
				} else if (selectedRect.top < menuRect.top) {
					menuRef.current.scrollTop -= menuRect.top - selectedRect.top
				}
			}
		}
	}, [selectedIndex])

	const renderOptionContent = (option: ContextMenuQueryItem) => {
		switch (option.type) {
			case ContextMenuOptionType.Problems:
				return <span>Problems</span>
			case ContextMenuOptionType.Terminal:
				return <span>Terminal</span>
			case ContextMenuOptionType.URL:
				return <span>Paste URL to fetch contents</span>
			case ContextMenuOptionType.NoResults:
				return <span>No results found</span>
			case ContextMenuOptionType.Git:
				if (option.value) {
					return (
						<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
							<span className="ph-no-capture" style={{ lineHeight: "1.2" }}>
								{option.label}
							</span>
							<span
								className="ph-no-capture"
								style={{
									fontSize: "0.85em",
									opacity: 0.7,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									lineHeight: "1.2",
								}}>
								{option.description}
							</span>
						</div>
					)
				} else {
					return <span>Git Commits</span>
				}
			case ContextMenuOptionType.File:
			case ContextMenuOptionType.Folder:
				if (option.value) {
					// Use label if it differs from just the basename (indicates workspace prefix or custom label)
					const displayText =
						option.label && option.label !== option.value.split("/").pop() ? option.label : option.value

					return (
						<>
							{!displayText.includes(":") && <span>/</span>}
							{displayText.startsWith("/.") && <span>.</span>}
							<span
								className="ph-no-capture"
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									direction: displayText.includes(":") ? "ltr" : "rtl",
									textAlign: "left",
								}}>
								{displayText.includes(":") ? displayText : cleanPathPrefix(displayText) + "\u200E"}
							</span>
						</>
					)
				} else {
					return <span>{option.type === ContextMenuOptionType.File ? "Files" : "Directories"}</span>
				}
		}
	}

	const getIconForOption = (option: ContextMenuQueryItem): string => {
		switch (option.type) {
			case ContextMenuOptionType.File:
				return "file"
			case ContextMenuOptionType.Folder:
				return "folder"
			case ContextMenuOptionType.Problems:
				return "warning"
			case ContextMenuOptionType.Terminal:
				return "terminal"
			case ContextMenuOptionType.URL:
				return "link"
			case ContextMenuOptionType.Git:
				return "git-commit"
			case ContextMenuOptionType.NoResults:
				return "info"
			default:
				return "file"
		}
	}

	const isOptionSelectable = (option: ContextMenuQueryItem): boolean => {
		return option.type !== ContextMenuOptionType.NoResults && option.type !== ContextMenuOptionType.URL
	}

	return (
		<div
			onMouseDown={onMouseDown}
			style={{
				position: "absolute",
				bottom: "calc(100% - 12px)",
				left: 15,
				right: 15,
				overflowX: "hidden",
			}}>
			<div
				ref={menuRef}
				style={{
					backgroundColor: "var(--vscode-dropdown-background)",
					border: "1px solid var(--vscode-editorGroup-border)",
					borderRadius: "8px",
					boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
					zIndex: 1000,
					display: "flex",
					flexDirection: "column",
					maxHeight: "280px",
					overflowY: "auto",
					paddingBottom: "4px",
				}}>
				{/* Header */}
				<div
					style={{
						padding: "8px 12px",
						fontSize: "11px",
						fontWeight: 600,
						color: "var(--vscode-descriptionForeground)",
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						borderBottom: "1px solid var(--vscode-editorGroup-border)",
						display: "flex",
						alignItems: "center",
						gap: "6px",
					}}>
					<i className="codicon codicon-mention" style={{ fontSize: "12px" }} />
					Add Context
				</div>

				{showDelayedLoading && searchQuery && (
					<div
						style={{
							padding: "8px 12px",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							opacity: 0.7,
						}}>
						<i className="codicon codicon-loading codicon-modifier-spin" style={{ fontSize: "14px" }} />
						<span style={{ fontSize: "12px" }}>Searching...</span>
					</div>
				)}
				{filteredOptions.map((option, index) => {
					// Include workspace name in key for files/folders to handle duplicates across workspaces
					const workspacePrefix = option.workspaceName ? `${option.workspaceName}:` : ""
					const generatedKey = `${option.type}-${workspacePrefix}${option.value || index}`

					return (
						<div
							key={generatedKey}
							onClick={() => {
								if (isOptionSelectable(option)) {
									// Use label if it contains workspace prefix, otherwise use value
									const mentionValue = option.label?.includes(":") ? option.label : option.value
									onSelect(option.type, mentionValue)
								}
							}}
							onMouseEnter={() => isOptionSelectable(option) && setSelectedIndex(index)}
							style={{
								padding: "6px 12px",
								margin: "2px 6px",
								borderRadius: "8px",
								cursor: isOptionSelectable(option) ? "pointer" : "default",
								color:
									index === selectedIndex && isOptionSelectable(option)
										? "var(--vscode-quickInputList-focusForeground)"
										: "var(--vscode-menu-foreground)",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								backgroundColor:
									index === selectedIndex && isOptionSelectable(option)
										? "var(--vscode-quickInputList-focusBackground)"
										: "transparent",
							}}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									flex: 1,
									minWidth: 0,
									overflow: "hidden",
									fontSize: "12px",
								}}>
								<i
									className={`codicon codicon-${getIconForOption(option)}`}
									style={{
										marginRight: "8px",
										flexShrink: 0,
										fontSize: "14px",
										opacity: 0.8,
									}}
								/>
								<span
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										fontSize: "12px",
									}}>
									{renderOptionContent(option)}
								</span>
							</div>
							{(option.type === ContextMenuOptionType.File ||
								option.type === ContextMenuOptionType.Folder ||
								option.type === ContextMenuOptionType.Git) &&
								!option.value && (
									<i
										className="codicon codicon-chevron-right"
										style={{
											fontSize: "12px",
											flexShrink: 0,
											marginLeft: 8,
											opacity: 0.5,
										}}
									/>
								)}
							{(option.type === ContextMenuOptionType.Problems ||
								option.type === ContextMenuOptionType.Terminal ||
								((option.type === ContextMenuOptionType.File ||
									option.type === ContextMenuOptionType.Folder ||
									option.type === ContextMenuOptionType.Git) &&
									option.value)) && (
								<i
									className="codicon codicon-add"
									style={{
										fontSize: "12px",
										flexShrink: 0,
										marginLeft: 8,
										opacity: 0.5,
									}}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)

}

export default ContextMenu
