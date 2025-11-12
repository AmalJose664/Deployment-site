'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useGetProjectByIdQuery } from "@/store/services/projectsApi"
import { useCreateDeploymentMutation, useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"

import ProjectLoading from "./components/ProjectLoading"
import ProjectError from "./components/ProjectError"
import { ProjectContent } from "./components/Content"
import { useDeploymentSSE } from "@/hooks/useUpdatesSse"
import { useGetDeploymentLogsQuery } from "@/store/services/logsApi"
import { useDispatch } from "react-redux"
import { addLogs, clearLogs } from "@/store/slices/logSlice"

interface ProjectPageContainerProps {
	projectId: string
	tab: string | undefined
}

export function ProjectPageContainer({ projectId, tab }: ProjectPageContainerProps) {
	const router = useRouter()
	const dispatch = useDispatch()

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
	const { data: deployment } = useGetDeploymentByIdQuery(
		{
			id: project?.deployments
				? project.deployments[project.deployments.length - 1]
				: "",
			params: {},
		},
		{ skip: !project?.deployments?.length }
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
	useDeploymentSSE(project?._id, deployment?.status, deployment?._id,)




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
			onBack={() => router.push('/projects')}
			showBuild={showBuild}
			setShowBuild={setShowBuild}
			onCreateDeployment={handleCreateDeployment}
		/>
	)
}
