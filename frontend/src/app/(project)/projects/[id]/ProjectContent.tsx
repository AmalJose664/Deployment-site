'use client'
import { FiMoreHorizontal } from "react-icons/fi";
import { TiArrowLeft } from "react-icons/ti";
import { useEffect, useRef, useState } from 'react';
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
import { Logs } from "@/components/LogsComponent";
import { ProjectStatus } from "@/types/Project";
import { useDispatch } from "react-redux";
import { addLog } from "@/store/slices/logSlice";
import { Log } from "@/types/Log";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation"






interface ProjectDetailProps {
	projectId: string;
	onBack?: () => void;
}

export function ProjectContent({ projectId, onBack }: ProjectDetailProps) {
	const router = useRouter()

	const { data: project, isLoading, isError, error, refetch } = useGetProjectByIdQuery({ id: projectId, params: { user: "true" } })

	const { data: deployment } = useGetDeploymentByIdQuery(
		{ id: project?.deployments ? project.deployments[project.deployments.length - 1] : "", params: {} }
		, { skip: !project?.deployments?.[0] }
	)
	const dispatch = useDispatch()
	useEffect(() => {
		if (!deployment?._id) return;
		if (
			deployment.status !== ProjectStatus.BUILDING &&
			deployment.status !== ProjectStatus.QUEUED
		) {
			return;
		}

		console.log("Starting SSE for deployment:", deployment._id);

		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/deployments/${deployment._id}/logs/stream`,
			{ withCredentials: true }
		);
		setShowBuild(true)
		eventSource.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);
			if (receivedData.type === "LOG") {
				const log = receivedData.data as Log
				dispatch(addLog(log))
			}
		};

		eventSource.onerror = (error) => {
			console.log(eventSource.readyState)
			if (eventSource.readyState === EventSource.CLOSED) {
				console.log('SSE connection closed by server');
				eventSource.close();
				return;
			}

			if (eventSource.readyState === EventSource.CONNECTING) {
				console.log('SSE reconnecting...');
				return;
			}

			console.error('SSE connection failed');
			eventSource.close();
		};
		eventSource.addEventListener('done', () => {
			console.log('Stream complete');
			eventSource.close();
		});
		eventSource.addEventListener('close', () => {
			console.log('Stream completed -------');
			eventSource.close();
		});

		return () => {
			eventSource.close();
		};
	}, [deployment?._id]);

	const [showBuild, setShowBuild] = useState(false)

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
							<button onClick={() => router.back()}
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
				<div className='dark:bg-neutral-900 bg-white w-full  rounded-md mb-6 px-4 py-6'>

					{(!project.deployments || project.deployments.length === 0) && <NoDeployment
						projectId={project._id} refetch={refetch} />}

					<ProjectOverview project={project} deploymentCommitHash={deployment?.commitHash} deploymentDuration={deployment?.performance.totalDuration} />

					<div className="border rounded-md">
						<button className="p-4 w-full " onClick={() => setShowBuild(!showBuild)}>
							<span className="flex flex-row-reverse gap-2 items-center justify-end text-primary">
								Build Logs<MdKeyboardArrowRight className="size-6 transition-all duration-200" style={{ transform: `rotateZ(${showBuild ? "90" : "0"}deg)` }} />
							</span>
						</button>
						<AnimatePresence mode="sync">

							{showBuild && (
								<motion.div initial={{ opacity: 0, height: 0 }}

									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className='dark:bg-stone-900 bg-stone-100 h-auto'>
									<div >
										<Logs />
									</div>
								</motion.div>
							)}
						</AnimatePresence >
					</div>

				</div>

				{(project.deployments && project.deployments.length > 0 && deployment) &&
					<ProjectCurrentDeployment deployment={deployment} projectBranch={project.branch} repoURL={project.repoURL} />}

				{project.deployments && project.deployments.length > 0 && <ProjectSimpleStats />}

			</main>
		</div>
	);
}
