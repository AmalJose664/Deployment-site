"use client"

import FilesComponent from "@/components/FilesComponent";
import { Logs } from "@/components/LogsComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { Button } from "@/components/ui/button";
import StatusIcon from "@/components/ui/StatusIcon";
import { formatDuration, getGithubBranchUrl, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils";
import { useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"
import { useGetDeploymentLogsQuery } from "@/store/services/logsApi";
import { Project, ProjectStatus } from "@/types/Project";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiGitCommit } from "react-icons/fi";
import { MdAccessTime, MdKeyboardArrowRight } from "react-icons/md";
import { IoIosCube, IoMdGitBranch, IoMdGlobe } from "react-icons/io";
import { TiArrowLeft } from "react-icons/ti";
import { useRouter } from 'next/navigation'


const DeploymentPageContainer = ({ deploymentId }: { deploymentId: string }) => {
	const { data: deployment, isLoading, error, isError } = useGetDeploymentByIdQuery({ id: deploymentId, params: { include: "project" } })
	const [showLogs, setShowLogs] = useState(false)
	const { data: logs, refetch } = useGetDeploymentLogsQuery(
		{ deploymentId: deployment?._id ?? "" },
		{ skip: !showLogs || !deployment?._id }
	)
	const router = useRouter()
	if (error || isError) {
		return <ErrorComponent error={error} id={deploymentId} field="Deployment" />
	}

	if (!deployment && !isLoading) {
		return <ErrorComponent error={{ message: "Deployment not found" }} id={deploymentId} field="Deployment" />
	}
	return (
		<div>
			<div className="min-h-screen bg-background">
				<div className="sticky top-0 z-10 bg-background dark:border-zinc-800 border-gray-200">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
						<button
							onClick={() => router.back()}
							className="border p-2 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-lg transition-colors group"
						>
							<TiArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
						</button>
					</div>
				</div>
				{isLoading ? (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="flex gap-6 items-center justify-center">
						<p className="text-gray-500">Loading...</p>
						<AiOutlineLoading3Quarters className="animate-spin " />
					</motion.div>
				) : (

					<div className="max-w-[1400px] mx-auto px-6  rounded-md py-4">
						<div className="mb-4 flex items-center justify-between px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
							<div>
								<h1 className="text-xl font-semibold text-primary flex gap-2 items-center">
									Deployment for {(deployment.project as Project).name} <IoIosCube />
								</h1>
								<p className="text-sm text-gray-500 mt-1 font-mono">{deployment._id}</p>
							</div>
							<div className='p-2 flex gap-2 items-center rounded-md border border-transparent hover:border-neutral-800'>
								<StatusIcon status={"READY"} />
								<span
									className={`text-sm flex flex-col font-medium px-2 py-1 rounded ${getStatusColor(
										deployment?.status as ProjectStatus
									)}`}
								>
									{deployment.status}
								</span>
							</div>
						</div>

						<div className="mb-4 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
							{(deployment.status !== ProjectStatus.CANCELED && deployment.status !== ProjectStatus.FAILED) && (
								<>
									<div className="p-3 ">
										<h3 className="text-xs  font-semibold text-green-500 uppercase tracking-wider mb-3">
											Live
										</h3>
										<div className="flex gap-3 items-center">
											<span>
												<IoMdGlobe className='size-4 text-less' />
											</span>
											<span className="flex gap-3 text-sm items-center">
												<Link
													href={`${window.location.protocol}//${(deployment.project as Project).subdomain}.${process.env.NEXT_PUBLIC_PROXY_SERVER}`}
												>
													{`${window.location.protocol}//${(deployment.project as Project).subdomain}`}
												</Link>
											</span>
										</div>
									</div>
									<hr />
								</>
							)}
							<div className="p-3 ">
								<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
									Branch
								</h3>
								<div className="flex gap-3 items-center">
									<span>
										<IoMdGitBranch className='size-4 text-less' />
									</span>
									<span className="flex gap-3 text-sm items-center">
										<Link
											href={getGithubBranchUrl((deployment.project as Project).repoURL, deployment.commit.id)}
										>
											{(deployment.project as Project).branch}
										</Link>
									</span>
								</div>
							</div>
							<hr />
							<div className="p-3 ">
								<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
									Commit
								</h3>
								<div className="flex gap-3 items-center">
									<span>
										<FiGitCommit className='size-4 text-less' />
									</span>
									<span className="flex gap-3 text-sm items-center">
										<Link href={getGithubCommitUrl("", deployment.commit.id)}> {deployment.commit.id}</Link>
										<p className="text-lg">/</p>
										<Link href={getGithubCommitUrl("", deployment.commit.msg)}> {deployment.commit.msg}</Link>
									</span>
								</div>
							</div>
							<hr />
							{(deployment.status === ProjectStatus.CANCELED || deployment.status === ProjectStatus.FAILED) && (
								<>
									<div className=" p-3 mt-3">
										<h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
											Error
										</h3>
										<div>
											<p className="text-sm text-red-400">{deployment.errorMessage || "Reason Unknown"}</p>
										</div>
									</div>
									<hr />
								</>
							)}
							<div className=" p-3 mt-3">
								<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
									Performance
								</h3>
								<div className="grid grid-cols-3 gap-6">
									<div>
										<div className="text-sm text-gray-500 mb-1">Install</div>
										<div className="text-xl font-semibold text-primary">
											{formatDuration(deployment.performance.installTime)}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-500 mb-1">Build</div>
										<div className="text-xl font-semibold text-primary">
											{formatDuration(deployment.performance.buildTime)}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-500 mb-1">Total</div>
										<div className="text-xl font-semibold text-primary">
											{formatDuration(deployment.performance.totalDuration)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mb-4 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
							<h4 className="font-semibold text-primary">
								Deployment Logs
							</h4>

							<div>
								<div className="border mt-3 rounded-md">
									<button
										className="px-4 py-3 w-full"
										onClick={() => setShowLogs(!showLogs)}
									>
										<span className="flex flex-row-reverse gap-2 items-center justify-end text-primary">
											Build Logs
											<MdKeyboardArrowRight
												className="size-6 transition-all duration-200"
												style={{
													transform: `rotateZ(${showLogs ? "90deg" : "0deg"})`,
												}}
											/>
										</span>
									</button>
									<div className="overflow-hidden">
										<AnimatePresence mode="sync">
											{showLogs && (
												<motion.div
													initial={{ opacity: 0, y: 20, height: 0 }}
													animate={{ opacity: 1, y: 0, height: "auto", }}
													exit={{ opacity: 0, y: -40, height: 0 }}
													transition={{ duration: 0.4, ease: "easeInOut" }}
													className="dark:bg-stone-900 bg-stone-100 h-auto"
												>
													<Logs
														deploymentId={deployment?._id || ""}
														deploymentSpecificLogs={logs}
														refetch={refetch} />
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
							</div>
						</div>


						<div className="mb-16 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
							<h4 className="font-semibold text-primary mb-4">
								Deployment Output Files
							</h4>
							<FilesComponent projectId={(deployment.project as Project)._id} deploymentId={deployment._id}>
								<h4 className="font-semibold text-primary">Build Output Files</h4>
							</FilesComponent>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
export default DeploymentPageContainer




