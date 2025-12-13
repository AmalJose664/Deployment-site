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

import PaginationComponent from "@/components/Pagination"
import { IoRocketOutline } from "react-icons/io5"
import OptionsComponent from "@/components/OptionsComponent"
import { BsArrowUpCircle } from "react-icons/bs"
import { useRouter } from "next/navigation"
import ChangeDeploymentModal from "@/components/modals/ChangeDeployment"
import DeploymentStatusButtons from "@/components/DeploymentStatusButtons"

interface AllDeploymentProps {
	projectId: string;
	currentDeployment: string
	repoURL: string;
	setTab: () => void
}

const AllDeployments = ({ projectId, currentDeployment, repoURL, setTab }: AllDeploymentProps) => {
	const router = useRouter()
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading, isError, error } = useGetProjectDeploymentsQuery({ id: projectId, params: { include: "project", page, limit } })
	const { data: deployments = [], meta } = data ?? {};


	const [search, setSearch] = useState("")
	const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null)
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
			{selectedDeploymentId && <ChangeDeploymentModal setSelectedDeploymentId={setSelectedDeploymentId} selectedDeploymentId={selectedDeploymentId} projectId={projectId} />}
			{isLoading && (
				<div className="flex items-center justify-center text-primary">
					Loading...
				</div>
			)}
			<div className="relative flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
				<div className="relative w-full sm:w-[90%] cats_intheworld">
					<CiSearch className="absolute top-2 left-3 size-5" />
					<Input value={search} onChange={(e) => setSearch(e.target.value)}
						className="mb-4 pl-12 w-full dark:bg-neutral-900 bg-white"
						placeholder="Branches, commits, id"
					/>
				</div>

				<DeploymentStatusButtons statuses={statuses} setStatuses={setStatuses} />
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
							<div className="flex-col flex gap-2 items-center flex-wrap">
								<div className="text-xs flex gap-2 items-center flex-wrap">
									<StatusIcon status={deployment.status} />
									<span className="text-primary break-all">
										{deployment._id}
									</span>
								</div>
								{currentDeployment === deployment._id && (
									<span className="py-1 px-2 border border-blue-500 rounded-full text-xs text-blue-400">
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
									<span className="flex gap-2 items-center">
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
							<div onClick={(e) => e.stopPropagation()}>
								<OptionsComponent parentClassName="" options={[
									{
										title: "Promote Deployment",
										actionFn: () => setSelectedDeploymentId(deployment._id),
										className: "",
										isDisabled: deployment.status != ProjectStatus.READY
											|| deployment._id === currentDeployment,
										Svg: BsArrowUpCircle
									},
									{
										title: "Inspect",
										actionFn: () => router.push("/deployments/" + deployment._id),
										className: "",
									},
									{
										title: "View Files",
										actionFn: () => router.push("/deployments/" + deployment._id + "#files"),
										className: "",
									},
								]} />
							</div>
						</Link>
					</div>
				)
			})}
			{meta?.totalPages > 1 && <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />}
			{((deployments?.length === 0 || !deployments) && !isLoading) && (
				<div>
					<NoDeployment
						buttonAction={setTab}
						titleText="No Deployments Yet"
						descriptionText="You haven&apos;t created any project deployment yet. Run your project by creating your new Deployment."
						buttonText="Create Deployment"
						buttonIcon={<IoRocketOutline />}
						learnMoreUrl="#"
					/>
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
