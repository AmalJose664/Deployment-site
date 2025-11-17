'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { projectApis, useGetProjectByIdQuery } from "@/store/services/projectsApi"
import { deployemntApis, useCreateDeploymentMutation, useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"

import ProjectLoading from "./components/ProjectLoading"
import ProjectError from "../../../../components/project/ProjectError"
import { ProjectContent } from "./components/Content"
import { useDeploymentSSE } from "@/hooks/useUpdatesSse"
import { useGetDeploymentLogsQuery } from "@/store/services/logsApi"
import { addLogs, clearLogs } from "@/store/slices/logSlice"
import { ProjectStatus } from "@/types/Project"
import { useAppDispatch } from "@/store/store"
import { toast } from "sonner"

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
		toast.success("New Deployment Started")
		await createDeployment(projectId)
		setShowBuild(true)
		await refetch()
	}
	const { data: tempDeployment } = useGetDeploymentByIdQuery(
		{
			id: project?.tempDeployment || "",
			params: {},
		},
		{
			skip: !project?.tempDeployment
		}
	)
	const { data: deployment } = useGetDeploymentByIdQuery(
		{
			id: project?.currentDeployment || "",
			params: {},
		},
		{
			skip: !project?.currentDeployment
		}
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

		await handleCreateDeployment()
		await refetch()
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
			tempDeployment={tempDeployment}
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
