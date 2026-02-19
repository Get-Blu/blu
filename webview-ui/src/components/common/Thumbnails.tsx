import { cn } from "@heroui/react"
import { StringRequest } from "@shared/proto/blu/common"
import React, { memo, useLayoutEffect, useRef, useState } from "react"
import { useWindowSize } from "react-use"
import { FileServiceClient } from "@/services/grpc-client"

interface ThumbnailsProps {
	images: string[]
	files: string[]
	style?: React.CSSProperties
	setImages?: React.Dispatch<React.SetStateAction<string[]>>
	setFiles?: React.Dispatch<React.SetStateAction<string[]>>
	onHeightChange?: (height: number) => void
	className?: string
}

const Thumbnails = ({ images, files, style, setImages, setFiles, onHeightChange, className }: ThumbnailsProps) => {
	const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const { width } = useWindowSize()

	useLayoutEffect(() => {
		if (containerRef.current) {
			let height = containerRef.current.clientHeight
			// some browsers return 0 for clientHeight
			if (!height) {
				height = containerRef.current.getBoundingClientRect().height
			}
			onHeightChange?.(height)
		}
		setHoveredIndex(null)
	}, [images, files, width, onHeightChange])

	const handleDeleteImages = (index: number) => {
		setImages?.((prevImages) => prevImages.filter((_, i) => i !== index))
	}

	const handleDeleteFiles = (index: number) => {
		setFiles?.((prevFiles) => prevFiles.filter((_, i) => i !== index))
	}

	const isDeletableImages = setImages !== undefined
	const isDeletableFiles = setFiles !== undefined

	const handleImageClick = (image: string) => {
		FileServiceClient.openImage(StringRequest.create({ value: image })).catch((err) =>
			console.error("Failed to open image:", err),
		)
	}

	const handleFileClick = (filePath: string) => {
		FileServiceClient.openFile(StringRequest.create({ value: filePath })).catch((err) =>
			console.error("Failed to open file:", err),
		)
	}

	return (
		<div
			className={cn("flex flex-wrap", className)}
			ref={containerRef}
			style={{
				gap: 5,
				rowGap: 3,
				...style,
			}}>
			{images.map((image, index) => (
				<div
					key={`image-${index}`}
					onMouseEnter={() => setHoveredIndex(`image-${index}`)}
					onMouseLeave={() => setHoveredIndex(null)}
					style={{
						position: "relative",
						transition: "transform 0.2s ease",
						transform: hoveredIndex === `image-${index}` ? "scale(1.05)" : "scale(1)",
					}}>
					<img
						alt={`Thumbnail image-${index + 1}`}
						onClick={() => handleImageClick(image)}
						src={image}
						style={{
							width: 42,
							height: 42,
							objectFit: "cover",
							borderRadius: 10,
							cursor: "pointer",
							border: "1px solid var(--vscode-widget-border)",
							boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
						}}
					/>
					{isDeletableImages && hoveredIndex === `image-${index}` && (
						<div
							onClick={(e) => {
								e.stopPropagation()
								handleDeleteImages(index)
							}}
							style={{
								position: "absolute",
								top: -6,
								right: -6,
								width: 16,
								height: 16,
								borderRadius: "50%",
								backgroundColor: "var(--vscode-badge-background)",
								color: "var(--vscode-badge-foreground)",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
							}}>
							<span
								className="codicon codicon-close"
								style={{
									fontSize: 10,
									fontWeight: "bold",
								}}></span>
						</div>
					)}
				</div>
			))}

			{files.map((filePath, index) => {
				const fileName = filePath.split(/[\\/]/).pop() || filePath

				return (
					<div
						key={`file-${index}`}
						onMouseEnter={() => setHoveredIndex(`file-${index}`)}
						onMouseLeave={() => setHoveredIndex(null)}
						style={{
							position: "relative",
							transition: "transform 0.2s ease",
							transform: hoveredIndex === `file-${index}` ? "scale(1.05)" : "scale(1)",
						}}>
						<div
							onClick={() => handleFileClick(filePath)}
							style={{
								width: 42,
								height: 42,
								borderRadius: 10,
								cursor: "pointer",
								backgroundColor: "var(--vscode-editor-background)",
								border: "1px solid var(--vscode-input-border)",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
							}}>
							<span
								className="codicon codicon-file"
								style={{
									fontSize: 18,
									color: "var(--vscode-foreground)",
								}}></span>
							<span
								style={{
									fontSize: 8,
									marginTop: 1,
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxWidth: "90%",
									whiteSpace: "nowrap",
									textAlign: "center",
									padding: "0 2px",
								}}
								title={fileName}>
								{fileName}
							</span>
						</div>
						{isDeletableFiles && hoveredIndex === `file-${index}` && (
							<div
								onClick={(e) => {
									e.stopPropagation()
									handleDeleteFiles(index)
								}}
								style={{
									position: "absolute",
									top: -6,
									right: -6,
									width: 16,
									height: 16,
									borderRadius: "50%",
									backgroundColor: "var(--vscode-badge-background)",
									color: "var(--vscode-badge-foreground)",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
									boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
								}}>
								<span
									className="codicon codicon-close"
									style={{
										fontSize: 10,
										fontWeight: "bold",
									}}></span>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default memo(Thumbnails)
