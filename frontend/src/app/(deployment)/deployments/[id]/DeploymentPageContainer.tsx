"use client"

import FilesComponent from "@/components/FilesComponent";
import { Logs } from "@/components/LogsComponent";
import { Button } from "@/components/ui/button";
import StatusIcon from "@/components/ui/StatusIcon";
import { formatDuration, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils";
import { useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"
import { useGetDeploymentLogsQuery } from "@/store/services/logsApi";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { FiGitCommit } from "react-icons/fi";
import { MdAccessTime, MdKeyboardArrowRight } from "react-icons/md";

const deployment = {
	_id: "dep_7x9k2m4n",
	project: {
		name: "MyApp Frontend",
		repository: "github.com/user/myapp"
	},
	commit: {
		id: "a3f8c92",
		msg: "Fix authentication bug and update dependencies"
	},
	userId: "user_abc123",
	status: "success", // can be: pending, building, success, failed
	performance: {
		installTime: 45000,
		buildTime: 120000,
		totalDuration: 165000
	},
	overWrite: false,
	completedAt: new Date("2024-11-19T10:30:00"),
	s3Path: "s3://deployments/myapp/a3f8c92",
	createdAt: new Date("2024-11-19T10:27:15"),
	updatedAt: new Date("2024-11-19T10:30:00")
};





const DeploymentPageContainer = ({ deploymentId }: { deploymentId: string }) => {
	// const { data: deployment } = useGetDeploymentByIdQuery({ id: deploymentId, params: {} })
	const { data: logs, refetch } = useGetDeploymentLogsQuery(
		{ deploymentId: deployment?._id ?? "" },
		{ skip: true }
	)
	const [] = useState(false)
	const [showLogs, setShowLogs] = useState(false)
	return (
		<div>
			<div className="min-h-screen bg-background mt-12">
				<div className="max-w-[1400px] mx-auto px-6">
					<div className="mb-4 flex items-center justify-between px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
						<div>
							<h1 className="text-xl font-semibold text-primary">
								Deployment for {deployment.project.name}
							</h1>
							<p className="text-sm text-gray-500 mt-1 font-mono">{deployment._id}</p>
						</div>
						<div className='p-2 flex gap-2 items-center rounded-md border border-transparent hover:border-neutral-800'>
							<StatusIcon status={"READY"} />
							<span
								className={`text-sm flex flex-col font-medium px-2 py-1 rounded ${getStatusColor(
									"READY"
								)}`}
							>
								{deployment.status}
							</span>
						</div>
					</div>

					<div className="mb-4 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
						<div className="border p-3 rounded-md">
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

						<div className="border p-3 rounded-md mt-3">
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
												<Logs deploymentId={deployment?._id || ""} refetch={refetch} />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>



					<div className="mb-4 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
						<FilesComponent projectId="68fb1ccb10b93de245fa9f55" deploymentId="691c312481ae43aa6716f1f8">
							<h4 className="font-semibold text-primary">Build Output Files</h4>
						</FilesComponent>
					</div>

				</div>
			</div>
		</div>
	)
}
export default DeploymentPageContainer