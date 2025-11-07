
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import AllDeployments from "./AllDeployments"
import { useState } from "react"
import ProjectSettings from "./ProjectSettings"

interface ProjectContentProps {
	project: Project
	deployment?: Deployment
	refetch: () => void
	onBack: () => void
	showBuild: boolean
	setShowBuild: (state: boolean) => void;
	tabFromUrl?: string
	onCreateDeployment: () => void
}

export function ProjectContent({
	project,
	deployment,
	refetch,
	onBack,
	tabFromUrl,
	showBuild,
	setShowBuild,
	onCreateDeployment
}: ProjectContentProps) {
	const [tab, setTabs] = useState(tabFromUrl || "project")
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

			<main className="max-w-[1400px] mx-auto px-6 py-4">
				<Tabs defaultValue="project" value={tab} onValueChange={setTabs} className="w-full ">
					<ProjectTabs />
					<TabsContent value="project">
						<>
							<div className="dark:bg-neutral-900 border bg-white w-full rounded-md mb-6 px-4 py-6">

								{(!project.deployments || project.deployments.length === 0) && (
									<NoDeployment onCreateDeployment={onCreateDeployment} />
								)}

								<ProjectOverview
									project={project}
									deploymentCommitHash={deployment?.commitHash}
									deploymentDuration={deployment?.performance?.totalDuration}
									errorMessage={deployment?.errorMessage}
								/>

								<div className="border dark:border-neutral-600 border-neutral-400 rounded-md">
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
									showLogs={() => setShowBuild(true)}
								/>
							)}

							{project.deployments && project.deployments?.length > 0 && <ProjectSimpleStats />}
						</>
					</TabsContent>
					<TabsContent value="deployments">
						<AllDeployments projectId={project._id} projectBranch={project.branch} repoURL={project.repoURL} setTab={() => setTabs("project")} />
					</TabsContent>
					<TabsContent value="settings">
						<ProjectSettings project={project} />
					</TabsContent>
					<TabsContent value="analytics">
						hey
					</TabsContent>
				</Tabs>


			</main>
		</div>
	)
}
