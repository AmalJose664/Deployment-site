'use client'

import { FiMoreHorizontal } from "react-icons/fi";
import { TiArrowLeft } from "react-icons/ti";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';


import { useGetProjectByIdQuery } from "@/store/services/projectsApi";
import ProjectLoading from "@/app/(project)/projects/[id]/components/ProjectLoading";
import ProjectError from "@/app/(project)/projects/[id]/components/ProjectError";
import ProjectTabs from "./components/ProjectTabs";
import ProjectOverview from "./components/ProjectOverview";
import ProjectCurrentDeployment from "./components/ProjectCurrentDeployment";
import ProjectSimpleStats from "./components/ProjectSimpleStats";
import NoDeployment from "./components/NoDeployment";
import { useGetDeploymentByIdQuery } from "@/store/services/deploymentApi";

interface ProjectDetailProps {
	projectId: string;
	onBack?: () => void;
}

export function ProjectContent({ projectId, onBack }: ProjectDetailProps) {

	const { data: project, isLoading, isError, error, refetch } = useGetProjectByIdQuery({ id: projectId, params: { user: "true" } })

	const { data: deployment } = useGetDeploymentByIdQuery(
		{ id: project?.deployments ? project.deployments[project.deployments.length - 1] : "", params: {} }
		, { skip: !project?.deployments?.[0] }
	)



	const [showBuild, setShowBuild] = useState(false)
	const [showDeployment, setshowDeployment] = useState(false)
	console.log("re render", project, deployment)
	if (isLoading) return <ProjectLoading />

	if (isError) return <ProjectError error={error} />

	if (!project) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-less">Project not found</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen ">
			<header className="border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
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

			<main className="max-w-7xl mx-auto px-6 py-8">
				<ProjectTabs />
				<div className='dark:bg-neutral-900 bg-white w-full  rounded-md mb-6 px-4 py-6'>

					{(!project.deployments || project.deployments.length === 0) && <NoDeployment
						projectId={project._id} refetch={refetch} />}

					<ProjectOverview project={project} deploymentCommitHash={deployment?.commitHash} deploymentDuration={deployment?.performance.totalDuration} />
					<hr />
					<div>
						<button onClick={() => setShowBuild(!showBuild)}>
							Build
						</button>
						<AnimatePresence mode="sync">

							{showBuild && (
								<motion.div initial={{ opacity: 0, height: 0 }}

									animate={{ opacity: 1, height: "20rem" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className='h-80 bg-stone-900'>
									Content
								</motion.div>
							)}
						</AnimatePresence >
					</div>
					<motion.div transition={{ duration: 0.4, ease: "easeInOut" }}>
						<button onClick={() => setshowDeployment(!showDeployment)}>
							Deployed
						</button>

						<AnimatePresence mode="sync" >
							{showDeployment && (
								<motion.div initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "20rem" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className='h-80 bg-gray-900'>
									Content D
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>

				{(project.deployments && project.deployments.length > 0 && deployment) && <
					ProjectCurrentDeployment deployment={deployment} projectBranch={project.branch} />}
				{project.deployments && project.deployments.length > 0 && <ProjectSimpleStats />}

			</main>
		</div>
	);
}
