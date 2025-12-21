"use client"
import StatusIcon from "@/components/ui/StatusIcon"
import { getStatusBg, getStatusColor, timeToSeconds } from "@/lib/moreUtils/combined"
import Link from "next/link"
import { IoIosCube, IoMdCloudDone, IoMdGitBranch } from "react-icons/io"
import { MdAccessTime } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { Project, ProjectStatus } from "@/types/Project"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"

import { useGetDeploymentsQuery } from "@/store/services/deploymentApi"
import PaginationComponent from "@/components/Pagination"
import NoDeployment from "@/app/(project)/projects/[id]/components/NoDeployment"
import { useRouter } from "next/navigation"
import DeploymentStatusButtons from "@/components/DeploymentStatusButtons";
import OptionsComponent from "@/components/OptionsComponent";
import { LoadingSpinner2 } from "@/components/LoadingSpinner";

const AllDeployments = () => {
	const [page, setPage] = useState(1)
	const limit = 10
	const { data, isLoading, isError, error } = useGetDeploymentsQuery({ params: { include: "project", page, limit } })
	const { data: deployments = [], meta } = data ?? {};

	console.log(deployments)
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
	const router = useRouter()

	const totalPages = meta?.totalPages


	return (
		<div className="min-h-screen bg-linear-to-br from-background to-slate-100 dark:from-background dark:to-neutral-900">
			<div className="max-w-[1400px] mx-auto px-6  rounded-md py-4">
				<h1 className="text-xl font-semibold text-primary flex gap-2 mb-4 items-center">
					All Deployments  <IoMdCloudDone />
				</h1>
				<div>
					<div className="relative flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
						<div className="relative w-full sm:w-[90%]">
							<CiSearch className="absolute top-2 left-3 size-5" />
							<Input value={search} onChange={(e) => setSearch(e.target.value)}
								className="mb-4 pl-12 w-full dark:bg-neutral-900 bg-white"
								placeholder="Branches, commits, id"
							/>
						</div>
						<DeploymentStatusButtons statuses={statuses} setStatuses={setStatuses} />

					</div>
					<LoadingSpinner2 isLoading={isLoading} />
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
										<div className="text-sm text-primary mb-1 wrap-break-word">{deployment.commit.msg}</div>
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
												title: "Show Project",
												actionFn: () => router.push("/projects/" + (deployment.project as Project)._id),
												className: "",
												Svg: IoIosCube
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
					{(isError && (error as any).status !== 404) && (
						<div className="flex items-center justify-center px-4">
							<div className="border p-4 rounded-md max-w-full">
								<p>Error Loading Deployments</p>
								<p className="wrap-break-word">{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message || "Something went wrong"}</p>
							</div>
						</div>
					)}

					{((deployments?.length === 0 || !deployments) && !isLoading) && (
						<div>

							<NoDeployment
								buttonAction={() => router.push("/projects/")}
								titleText="No Deployments Yet"
								descriptionText="You haven&apos;t created any project deployment yet. Run your project by creating your new Deployment."
								buttonText="Create Project"
								buttonIcon={<IoIosCube />}
								learnMoreUrl="#"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
export default AllDeployments