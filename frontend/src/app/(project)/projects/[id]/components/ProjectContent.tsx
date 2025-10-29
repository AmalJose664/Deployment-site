
'use client'

import { AnimatePresence, motion } from "motion/react"
import { FiMoreHorizontal } from "react-icons/fi"
import { TiArrowLeft } from "react-icons/ti"
import { MdKeyboardArrowRight } from "react-icons/md"

import ProjectTabs from "./ProjectTabs"
import ProjectOverview from "./ProjectOverview"
import ProjectCurrentDeployment from "./ProjectCurrentDeployment"
import ProjectSimpleStats from "./ProjectSimpleStats"
import NoDeployment from "./NoDeployment"
import { Logs } from "@/components/LogsComponent"

import { Project } from "@/types/Project"
import { Deployment } from "@/types/Deployment"

interface ProjectContentProps {
	project: Project
	deployment?: Deployment
	refetch: () => void
	onBack: () => void
	showBuild: boolean
	setShowBuild: (state: boolean) => void
	onCreateDeployment: () => void
}

export function ProjectContent({
	project,
	deployment,
	refetch,
	onBack,
	showBuild,
	setShowBuild,
	onCreateDeployment
}: ProjectContentProps) {

	return (
		<div className="min-h-screen">

			<header className="border-b border-gray-800">
				<div className="max-w-[1420px] mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={onBack}
								className="p-2 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-lg transition-colors"
							>
								<TiArrowLeft size={20} />
							</button>
							<div>
								<h1 className="text-xl font-semibold">{project.name}</h1>
							</div>
						</div>
						<button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
							<FiMoreHorizontal size={20} />
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-[1400px] mx-auto px-6 py-8">
				<ProjectTabs />

				<div className="dark:bg-neutral-900 bg-white w-full rounded-md mb-6 px-4 py-6">

					{(!project.deployments || project.deployments.length === 0) && (
						<NoDeployment onCreateDeployment={onCreateDeployment} />
					)}

					<ProjectOverview
						project={project}
						deploymentCommitHash={deployment?.commitHash}
						deploymentDuration={deployment?.performance?.totalDuration}
					/>

					<div className="border rounded-md">
						<button
							className="p-4 w-full"
							onClick={() => setShowBuild(!showBuild)}
						>
							<span className="flex flex-row-reverse gap-2 items-center justify-end text-primary">
								Build Logs
								<MdKeyboardArrowRight
									className="size-6 transition-all duration-200"
									style={{
										transform: `rotateZ(${showBuild ? "90deg" : "0deg"})`,
									}}
								/>
							</span>
						</button>

						<AnimatePresence mode="sync">
							{showBuild && (
								<motion.div
									initial={{ opacity: 0, y: 20, height: 0 }}
									animate={{ opacity: 1, y: 0, height: "auto", }}
									exit={{ opacity: 0, y: -40, height: 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className="dark:bg-stone-900 bg-stone-100 h-auto"
								>
									<Logs deploymentId={deployment?._id || ""} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{project.deployments && project.deployments?.length > 0 && deployment && (
					<ProjectCurrentDeployment
						deployment={deployment}
						projectBranch={project.branch}
						repoURL={project.repoURL}
					/>
				)}

				{project.deployments && project.deployments?.length > 0 && <ProjectSimpleStats />}
			</main>
		</div>
	)
}
