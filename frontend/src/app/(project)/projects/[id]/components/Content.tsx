
'use client'

import { FiMoreHorizontal } from "react-icons/fi"
import { TiArrowLeft } from "react-icons/ti"
import ProjectTabs from "./ProjectTabs"
import { Project } from "@/types/Project"
import { Deployment } from "@/types/Deployment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AllDeployments from "./TabAllDeployments"
import { useState } from "react"
import ProjectSettings from "./TabProjectSettings"
import ProjectAnalytics from "./TabProjectAnalytics"
import TabProject from "./TabProject"
import TabFiles from "./TabFiles"

interface ProjectContentProps {
	project: Project
	deployment?: Deployment
	refetch: () => void
	onBack: () => void
	showBuild: boolean
	setShowBuild: (state: boolean) => void;
	tabFromUrl?: string
	reDeploy: () => void;
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
	reDeploy,
	onCreateDeployment
}: ProjectContentProps) {
	const [tab, setTabs] = useState(tabFromUrl || "project")
	console.log("--------------------project--------------------", project.name)
	return (
		<div className="min-h-screen">
			<Tabs defaultValue="project" value={tab} onValueChange={setTabs} className="w-full ">

				<header className="border-b dark:border-neutral-800 border-neutral-200 ">
					<div className="max-w-[1420px] mx-auto px-6 py-4">

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-6">
								<button
									onClick={onBack}
									className="p-2 dark:hover:bg-zinc-800 hover:bg-zinc-200 rounded-lg transition-colors"
								>
									<TiArrowLeft size={20} />
								</button>
								<div>
									<h1 className="text-xl font-semibold">{project.name}</h1>
								</div>
								<div>
									<ProjectTabs />
								</div>
							</div>
							<button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
								<FiMoreHorizontal size={20} />
							</button>
						</div>
					</div>
				</header>

				<main className="max-w-[1400px] mx-auto px-6 py-4">
					<TabsContent value="project">
						<TabProject
							project={project}
							deployment={deployment}
							onCreateDeployment={onCreateDeployment}
							setShowBuild={setShowBuild}
							reDeploy={reDeploy}
							showBuild={showBuild}
							setTabs={setTabs}
						/>
					</TabsContent>
					<TabsContent value="deployments">
						<AllDeployments projectId={project._id} projectBranch={project.branch} repoURL={project.repoURL} setTab={() => setTabs("project")} />
					</TabsContent>
					<TabsContent value="settings">
						<ProjectSettings project={project} />
					</TabsContent>
					<TabsContent value="analytics">
						<ProjectAnalytics projectId={project._id} />
					</TabsContent>
					<TabsContent value="files">
						<TabFiles projectId={project._id} deploymentId={deployment?._id} />
					</TabsContent>


				</main>
			</Tabs>

		</div >
	)
}
