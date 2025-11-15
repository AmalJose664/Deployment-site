'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { projectApis, useGetProjectByIdQuery } from "@/store/services/projectsApi"
import { deployemntApis, useCreateDeploymentMutation, useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"

import ProjectLoading from "./components/ProjectLoading"
import ProjectError from "../../../../components/ProjectError"
import { ProjectContent } from "./components/Content"
import { useDeploymentSSE } from "@/hooks/useUpdatesSse"
import { useGetDeploymentLogsQuery } from "@/store/services/logsApi"
import { addLogs, clearLogs } from "@/store/slices/logSlice"
import { ProjectStatus } from "@/types/Project"
import { useAppDispatch } from "@/store/store"

interface ProjectPageContainerProps {
	projectId: string
	tab: string | undefined
}

export function ProjectPageContainer({ projectId, tab }: ProjectPageContainerProps) {
	const router = useRouter()
	const dispatch = useAppDispatch();

	const {
		data: project,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetProjectByIdQuery({ id: projectId, params: { user: "true" } })

	const [createDeployment, { }] = useCreateDeploymentMutation()
	const [showBuild, setShowBuild] = useState(false)
	const handleCreateDeployment = async () => {
		await createDeployment(projectId)
		await refetch()
		setShowBuild(true)
	}
	const { data: tempDeployment } = useGetDeploymentByIdQuery(
		{
			id: project?.deployments?.length !== 0 && project?.tempDeployment
				? project?.tempDeployment
				: "",
			params: {},
		},
		{ skip: (project?.deployments?.length === 0 && !!project.tempDeployment) }
	)
	const { data: deployment } = useGetDeploymentByIdQuery(
		{
			id: project?.deployments?.length !== 0 && project?.currentDeployment
				? project?.currentDeployment
				: "",
			params: {},
		},
		{ skip: (project?.deployments?.length === 0 && !!project.currentDeployment) }
	)
	const { data: initialLogs } = useGetDeploymentLogsQuery(
		{ deploymentId: deployment?._id ?? "" },
		{ skip: !deployment?._id }
	)

	useEffect(() => {
		if (initialLogs?.length) {
			dispatch(addLogs(initialLogs))
		}
		return () => { dispatch(clearLogs()) }
	}, [initialLogs, dispatch])
	useDeploymentSSE(project, refetch, tempDeployment,)

	const reDeploy = async () => {
		if (!project || !deployment) return
		dispatch(
			projectApis.util.updateQueryData(
				"getProjectById",
				{ id: project._id, params: { user: "true" } },
				(draft) => {
					const newData = {
						status: ProjectStatus.QUEUED,
					}
					Object.assign(draft, newData)
				}
			)
		)
		dispatch(
			deployemntApis.util.updateQueryData(
				"getDeploymentById",
				{ id: deployment._id, params: {} },
				(draft) => {
					const newData = {
						status: ProjectStatus.QUEUED,
					}
					Object.assign(draft, newData)
				}
			)
		)
		await handleCreateDeployment()

	}


	if (!project && !isLoading) {
		return (
			<ProjectError error={{ message: "project not found" }} />
		)
	}

	if (isError) return <ProjectError error={error} />

	if (isLoading) return <ProjectLoading />



	return (
		<ProjectContent
			project={project}
			deployment={deployment}
			tabFromUrl={tab}
			refetch={refetch}
			reDeploy={reDeploy}
			onBack={() => router.push('/projects')}
			showBuild={showBuild}
			setShowBuild={setShowBuild}
			onCreateDeployment={handleCreateDeployment}
		/>
	)
}
