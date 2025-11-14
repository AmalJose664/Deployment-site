import { formatBytes } from "@/lib/utils"
import { useGetDeploymentFilesQuery } from "@/store/services/deploymentApi"

import { RiFileWarningLine } from "react-icons/ri";
import { FaFolder, FaRegFileAlt } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { CiFolderOn } from "react-icons/ci";

import { useState } from "react"

interface TabFilesProps {
	projectId: string
	deploymentId?: string
}


const TabFiles = ({ projectId, deploymentId }: TabFilesProps) => {

	const { data: filesData, isLoading, error } = useGetDeploymentFilesQuery({ id: deploymentId || "", params: {} }, {
		skip: !deploymentId
	})

	const files = filesData?.fileStructure?.files || []
	const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
	if (!deploymentId) {
		return (
			<div className="flex flex-col gap-2 dark:bg-[#111111] border items-center justify-center bg-white text-neutral-400 p-8 rounded-lg text-center">
				<RiFileWarningLine size={22} />  <p>No deployment to show files</p>
				<div className="space-y-1 w-full">
					{[1, 1, 1, 1, 1, 1, 1].map((_, index) => (
						<div
							key={index}
							className="flex border items-center  justify-between group gap-4 py-2 px-3 hover:bg-secondary rounded"
						>
							<div className="flex items-center gap-2 animate-pulse group-hover:border flex-1 min-w-0">
								<FaRegFileAlt size={16} className="text-less shrink-0" />
								<span className="text-some-less text-sm group-hover:border truncate rounded-md bg-secondary w-[30%] h-4 ">{''}</span>
							</div>
							<span className="text-less text-xs shrink-0">
								{''}
							</span>
						</div>
					))}
				</div>
			</div>
		);
	}
	if (!filesData?.fileStructure) {
		return (
			<div className="flex gap-2 dark:bg-[#111111] border items-center justify-center bg-white text-neutral-400 p-8 rounded-lg text-center">
				<RiFileWarningLine size={22} />  <p>No files available for this deployment currently</p>
			</div>
		);
	}
	const root = buildFileTree(files || [])

	return (
		<div className="border rounded-md px-4 py-6 dark:bg-[#111111] bg-white">
			<div className="">
				<div className="flex items-center justify-between mb-4 pb-4 border rounded-md p-4">
					<div>
						<h2 className="text-xl font-semibold mb-1">Build Output Files</h2>
						<p className="text-sm text-neutral-400">
							{files.length} files • {formatBytes(filesData.fileStructure.totalSize)}
						</p>
					</div>

					<div className="flex gap-2 border dark:border-neutral-700 border-neutral-300 rounded p-1">
						<button
							onClick={() => setViewMode('tree')}
							className={`px-3 py-1 text-sm rounded transition ${viewMode === 'tree'
								? 'dark:bg-neutral-700 bg-neutral-300 text-primary'
								: 'text-neutral-400 dark:hover:text-neutral-200 hover:text-neutral-800'
								}`}
						>
							Tree
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`px-3 py-1 text-sm rounded transition ${viewMode === 'list'
								? 'dark:bg-neutral-700 bg-neutral-300 text-primary'
								: 'text-neutral-400 dark:hover:text-neutral-200 hover:text-neutral-800'
								}`}
						>
							List
						</button>
					</div>
				</div>

				<div className="border rounded-md">
					{viewMode === 'tree' ? (
						<FileTreeNode node={root} />
					) : (
						<div className="space-y-1">
							{files.map((file, index) => (
								<div
									key={index}
									className="flex items-center justify-between gap-4 py-2 px-3 hover:bg-secondary rounded"
								>
									<div className="flex items-center gap-2 flex-1 min-w-0">
										<FaRegFileAlt size={16} className="text-less shrink-0" />
										<span className="text-some-less text-sm truncate">{file.name}</span>
									</div>
									<span className="text-less text-xs shrink-0">
										{formatBytes(file.size)}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

const buildFileTree = (files: { name: string, size: number }[]) => {
	const root: any = { name: "root", children: {}, files: [] }
	files.forEach((file) => {

		const parts = file.name.split("/")
		let current = root
		parts.forEach((part, index) => {
			if (index === parts.length - 1) {
				// its a file, end of string in files[].name
				current.files.push({ name: part, size: file.size, fullPath: file.name })
			}
			else {
				// its a directory
				if (!current.children[part]) {
					current.children[part] = { name: part, children: {}, files: [] }
				}
				current = current.children[part] // going forward to that children
			}
		})
	})
	return root
}
type node = {
	children: node,
	name: string,
	files?: {
		name: string,
		size: number,
		fullPath: string
	}[]

}
const FileTreeNode = ({ node, depth = 0 }: { node: node; depth?: number }) => {
	const [isOpen, setIsOpen] = useState(depth === 0);

	return (
		<div>
			{node.name !== 'root' && (
				<button
					className="flex w-full items-center gap-2 py-1.5 px-2 hover:bg-secondary rounded cursor-pointer"
					style={{ paddingLeft: `${depth * 20 + 8}px` }}
					onClick={() => setIsOpen(!isOpen)}
				>
					<span className="text-primary">
						{/* {isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />} */}
						<FiChevronRight size={16} className="transition-all duration-200" style={{ transform: `rotate(${isOpen ? "90" : "0"}deg)` }} />
					</span>
					{isOpen ? <CiFolderOn size={16} className="text-blue-500" /> : <FaFolder size={16} className="text-blue-500" />}

					<span className="text-some-less text-sm">{node.name}</span>
				</button>
			)}

			{isOpen && (
				<>
					{/* Render subdirectories */}
					{Object.values(node.children).map((child: any) => (
						<FileTreeNode key={child.name} node={child} depth={depth + 1} />
					))}

					{/* Render files */}
					{node.files && node.files.map((file: any) => (
						<div
							key={file.fullPath}
							className="flex items-center justify-between gap-2 py-1.5 px-2 hover:bg-secondary rounded"
							style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
						>
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<FaRegFileAlt size={16} className="text-neutral-400 shrink-0" />
								<span className="text-some-less text-sm truncate">{file.name}</span>
							</div>
							<span className="text-neutral-500 text-xs shrink-0 mr-6">
								{(file.fullPath)}
							</span>
							<span className="text-neutral-500 text-xs shrink-0">
								{formatBytes(file.size)}
							</span>
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default TabFiles