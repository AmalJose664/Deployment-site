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

interface AllDeploymentProps {
	projectId: string;
	currentDeployment: string
	repoURL: string;
	setTab: () => void
}

const AllDeployments = ({ projectId, currentDeployment, repoURL, setTab }: AllDeploymentProps) => {


	const { data: deployments, isLoading, isError, error } = useGetProjectDeploymentsQuery({ id: projectId, params: { project: true } })
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
				d.commit.id.toLowerCase().includes(searchLower) ||
				d.commit.msg.toLowerCase().includes(searchLower) ||
				(d.project as Project).name.toLowerCase().includes(searchLower)

			return matchesSearch
		})
		return { filteredDeployments: filtered, statusCounts: counts }
	}, [deployments, search, statuses])



	return (
		<div>
			{isLoading && (
				<div className="flex items-center justify-center text-primary">
					Loading...
				</div>
			)}
			<div className="relative flex gap-2 items-center justify-between">
				<CiSearch className="absolute top-2 left-3 size-5" />
				<Input value={search} onChange={(e) => setSearch(e.target.value)}
					className="mb-4 pl-12 w-[90%]"
					placeholder="Branches, commits, id"
				/>
				<Popover>
					<PopoverTrigger className="border flex gap-2 mb-4 items-center  py-1 px-2 rounded-md ">
						<span className="text-sm text-primary">Status {Object.values(statuses).filter(Boolean).length} / 6 </span><IoIosArrowDown />
					</PopoverTrigger>
					<PopoverContent className="max-w-60">
						<div>
							{Object.keys(statuses).map((st) => (
								<div key={st} className="flex gap-8 items-center hover:border-neutral-300 dark:hover:border-neutral-700 rounded-md border border-transparent pl-4">
									<input
										type="checkbox" className="border-none ring-0" checked={statuses[st]}
										onChange={() => setStatuses({ ...statuses, [st]: !statuses[st] })} />
									<div className={getStatusBg(st) + " w-4 h-4 rounded-full border"} />
									<label htmlFor="">{st.slice(0, 1).toUpperCase() + st.slice(1, 20).toLowerCase()}</label>
								</div>
							)
							)}
						</div>
					</PopoverContent>
				</Popover>

			</div>
			<div className="flex items-center mb-4 gap-3">
				{Object.entries(statusCounts).map((value, i) => (
					value[1] > 0 && (
						<div key={i} className={getStatusBg(value[0]) + " rounded-full flex items-center"}>
							<span className="text-primary text-xs px-2 py-1">
								{value[0]}
							</span>
							<span className={"bg-blue-300 text-primary text-xs px-[8px] py-[2px] mr-1 rounded-full"}>
								{value[1]}
							</span>
						</div>
					)

				))}

			</div>
			{filteredDeployments?.length && filteredDeployments.map((deployment) => {
				return (
					<div key={deployment._id} className="divide-y dark:bg-neutral-900 bg-white divide-gray-800 border mb-1 dark:border-neutral-800 border-neutral-300 rounded-md">
						<Link
							href={""}
							className="hover:no-underline px-3 py-2 flex gap-4 justify-between items-center dark:hover:bg-zinc-800/50 hover:bg-neutral-300 transition-colors"
						>
							<div className="text-xs flex gap-2 items-center">
								<StatusIcon status={deployment.status} />
								<span className="text-primary">
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
							<div>
								<p className="text-sm">{(deployment.project as Project).name}</p>
							</div>
							<div className="flex gap-2 flex-col">
								<div className=" text-sm text-primary mb-1">{deployment.commit.id.slice(0, 10)}</div>
								<div className=" text-sm text-primary mb-1">{deployment.commit.msg}</div>
							</div>
							<div className="flex items-center gap-4 text-xs text-gray-400">
								<div className="flex items-center text-xs gap-1.5">
									<IoMdGitBranch size={12} />
									<div >{(deployment.project as Project).branch}</div>
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
			{((deployments?.length === 0 || !deployments) && !isLoading) && (
				<div>

					<NoDeployment onCreateDeployment={setTab} />
				</div>
			)}
			{(isError && (error as any).status !== 404) && (
				<div className="flex   items-center justify-center">
					<div className="border  p-4 rounded-md">
						<p>Error Loading Deployments</p>
						<p>{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message || "Something went wrong"}</p>
					</div>
				</div>
			)}
		</div>
	)
}
export default AllDeployments