import StatusIcon from "@/components/ui/StatusIcon"
import { getStatusBg, getStatusColor, timeToSeconds } from "@/lib/utils"
import { useGetProjectDeploymentsQuery } from "@/store/services/deploymentApi"
import Link from "next/link"

import { IoIosArrowDown, IoMdGitBranch } from "react-icons/io"
import { LiaExternalLinkAltSolid } from "react-icons/lia"
import { MdAccessTime } from "react-icons/md"
import { CiSearch } from "react-icons/ci"

import NoDeployment from "./NoDeployment"
import { Project, ProjectStatus } from "@/types/Project"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

interface AllDeploymentProps {
	projectId: string;
	currentDeployment: string
	repoURL: string;
	setTab: () => void
}

const AllDeployments = ({ projectId, currentDeployment, repoURL, setTab }: AllDeploymentProps) => {

	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading, isError, error } = useGetProjectDeploymentsQuery({ id: projectId, params: { project: true, page, limit } })
	const { data: deployments = [], meta } = data ?? {};


	const [search, setSearch] = useState("")
	const [statuses, setStatuses] = useState<Record<string, boolean>>(
		Object.fromEntries(Object.values(ProjectStatus).map((stats) => [stats, true]))
	)

	const { filteredDeployments, statusCounts } = useMemo(() => {
		if (!deployments) return { filteredDeployments: [], statusCounts: {} }
		const counts: Record<string, number> = {}
		Object.values(ProjectStatus).forEach((status) => {
			counts[status] = 0
		})

		const filtered = deployments.filter((d) => {
			if (counts[d.status] !== undefined) {
				counts[d.status]++
			}
			if (!statuses[d.status]) return false

			const searchLower = search.toLowerCase()
			const matchesSearch = !search ||
				d._id.toLowerCase().includes(searchLower) ||
				d.commit.id?.toLowerCase().includes(searchLower) ||
				d.commit.msg?.toLowerCase().includes(searchLower) ||
				(d.project as Project).name.toLowerCase().includes(searchLower)

			return matchesSearch
		})
		return { filteredDeployments: filtered, statusCounts: counts }
	}, [deployments, search, statuses])

	const totalPages = meta?.totalPages


	return (
		<div>
			{isLoading && (
				<div className="flex items-center justify-center text-primary">
					Loading...
				</div>
			)}
			<div className="relative flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
				<div className="relative w-full sm:w-[90%]">
					<CiSearch className="absolute top-2 left-3 size-5" />
					<Input value={search} onChange={(e) => setSearch(e.target.value)}
						className="mb-4 pl-12 w-full"
						placeholder="Branches, commits, id"
					/>
				</div>
				<Popover>
					<PopoverTrigger className="border flex gap-2 mb-4 items-center py-1 px-2 rounded-md whitespace-nowrap">
						<span className="text-sm text-primary">Status {Object.values(statuses).filter(Boolean).length} / 6 </span><IoIosArrowDown />
					</PopoverTrigger>
					<PopoverContent className="max-w-60">
						<div>
							{Object.keys(statuses).map((st) => (
								<div key={st} className="flex gap-8 items-center hover:border-neutral-300 dark:hover:border-neutral-700 rounded-md border border-transparent pl-4">
									<input
										type="checkbox" className="border-none ring-0" checked={statuses[st]}
										onChange={() => setStatuses({ ...statuses, [st]: !statuses[st] })} />
									<div className={getStatusBg(st)[0] + " w-4 h-4 rounded-full border"} />
									<label htmlFor="">{st.slice(0, 1).toUpperCase() + st.slice(1, 20).toLowerCase()}</label>
								</div>
							)
							)}
						</div>
					</PopoverContent>
				</Popover>

			</div>
			<div className="flex items-center mb-4 gap-3 flex-wrap">
				{Object.entries(statusCounts).map((value, i) => (
					(statuses[value[0]] && value[1] > 0) && (
						<div key={i} className={getStatusBg(value[0])[2] + " rounded-full flex items-center"}>
							<span className="dark:text-gray-200 text-gray-700 text-xs px-2 py-1">
								{value[0]}
							</span>
							<span className={getStatusBg(value[0])[1] + " text-black text-xs px-[8px] py-[2px] mr-1 rounded-full"}>
								{value[1]}
							</span>
						</div>
					)
				)
				)}

			</div>
			{filteredDeployments?.length !== 0 && filteredDeployments.map((deployment) => {
				return (
					<div key={deployment._id} className="divide-y dark:bg-neutral-900 bg-white divide-gray-800 border mb-3 dark:border-neutral-800 border-neutral-300 rounded-md">
						<Link
							href={"/deployments/" + deployment._id}
							className="hover:no-underline px-3 py-2 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start sm:items-center dark:hover:bg-zinc-800/50 hover:bg-neutral-300 transition-colors"
						>
							<div className="text-xs flex gap-2 items-center flex-wrap">
								<StatusIcon status={deployment.status} />
								<span className="text-primary break-all">
									{deployment._id}
								</span>
								{currentDeployment === deployment._id && (
									<span className="py-1 px-2 border rounded-full text-blue-400">
										current
									</span>
								)}
							</div>
							<div className="pt-1 flex gap-2 items-center text-sm">

								<span
									className={`text-xs flex flex-col font-medium px-2 py-1 rounded ${getStatusColor(
										deployment.status
									)}`}
								>
									{deployment.status}
									<span className="flex gap-2">
										<MdAccessTime size={12} />
										<span>{timeToSeconds(deployment.performance.totalDuration)}</span>
									</span>
								</span>
							</div>
							<div className="w-full sm:w-auto">
								<p className="text-sm">{(deployment.project as Project).name}</p>
							</div>
							<div className="flex gap-2 flex-col w-full sm:w-auto">
								<div className="text-sm text-primary mb-1 max-w-full sm:max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
									{deployment.commit.id}
								</div>
								<div className="text-sm text-primary mb-1 break-words">{deployment.commit.msg}</div>
							</div>
							<div className="flex items-center gap-4 text-xs text-gray-400">
								<div className="flex items-center text-xs gap-1.5">
									<IoMdGitBranch size={12} />
									<div>{(deployment.project as Project).branch}</div>
								</div>
							</div>
							<button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
								View Logs
								<LiaExternalLinkAltSolid size={12} />
							</button>
						</Link>
					</div>
				)
			})}
			{meta?.totalPages > 1 && <DeploymentsPagination page={page} setPage={setPage} totalPages={totalPages} />}
			{((deployments?.length === 0 || !deployments) && !isLoading) && (
				<div>

					<NoDeployment onCreateDeployment={setTab} />
				</div>
			)}
			{(isError && (error as any).status !== 404) && (
				<div className="flex items-center justify-center px-4">
					<div className="border p-4 rounded-md max-w-full">
						<p>Error Loading Deployments</p>
						<p className="break-words">{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message || "Something went wrong"}</p>
					</div>
				</div>
			)}

		</div>
	)
}
export default AllDeployments
interface PaginationProps {
	page: number,
	setPage: React.Dispatch<React.SetStateAction<number>>,
	totalPages: number
}
const DeploymentsPagination = ({ page, setPage, totalPages }: PaginationProps) => {
	return (
		<Pagination>
			<PaginationContent className="flex gap-4 items-center">
				<PaginationItem>
					<PaginationPrevious
						size={1}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(p => Math.max(1, p - 1))
						}}
						className={page === 1 ? "pointer-events-none opacity-50" : "no-underline hover:bg-accent"}
					/>
				</PaginationItem>

				{/* First page */}
				<PaginationItem>
					<PaginationLink
						size={1}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(1)
						}}
						isActive={page === 1}
						className="no-underline"
					>
						1
					</PaginationLink>
				</PaginationItem>

				{/* Left ellipsis */}
				{page > 3 && totalPages > 5 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Middle pages */}
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter(pageNum => {
						// Show pages around current page
						if (pageNum === 1 || pageNum === totalPages) return false
						if (totalPages <= 5) return true // Show all middle pages if total <= 5
						return Math.abs(pageNum - page) <= 1 // Show current ± 1
					})
					.map(pageNum => (
						<PaginationItem key={pageNum}>
							<PaginationLink
								size={1}
								href="#"
								onClick={(e) => {
									e.preventDefault()
									setPage(pageNum)
								}}
								isActive={page === pageNum}
								className="no-underline"
							>
								{pageNum}
							</PaginationLink>
						</PaginationItem>
					))}

				{/* Right ellipsis */}
				{page < totalPages - 2 && totalPages > 5 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Last page */}
				{totalPages > 1 && (
					<PaginationItem>
						<PaginationLink
							size={1}
							href="#"
							onClick={(e) => {
								e.preventDefault()
								setPage(totalPages)
							}}
							isActive={page === totalPages}
							className="no-underline"
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						size={1}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							setPage(p => Math.min(totalPages, p + 1))
						}}
						className={page === totalPages ? "pointer-events-none opacity-50" : "no-underline hover:bg-accent"}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}