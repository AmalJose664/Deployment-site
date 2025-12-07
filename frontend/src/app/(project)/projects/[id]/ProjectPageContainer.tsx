'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { projectApis, useGetProjectByIdQuery } from "@/store/services/projectsApi"
import { useCreateDeploymentMutation, useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"

import ProjectLoading from "./components/ProjectLoading"
import ErrorComponent from "../../../../components/ErrorComponent"
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
	} = useGetProjectByIdQuery({ id: projectId, params: { include: "user" } })

	const [createDeployment, { }] = useCreateDeploymentMutation()
	const [showBuild, setShowBuild] = useState(false)
	const [sseActive, setSseActive] = useState(false)
	const handleCreateDeployment = async () => {
		try {
			toast.success("New Deployment Started")
			await createDeployment(projectId).unwrap()
			setSseActive(true)
			setShowBuild(true)
			await refetch()
		} catch (error) {
			setSseActive(false)
		}
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
	const { data: lastDeployment } = useGetDeploymentByIdQuery(
		{
			id: project?.lastDeployment || "",
			params: {},
		},
		{
			skip: !project?.lastDeployment || !!project.currentDeployment
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
	const { data: initialLogs, refetch: refetchLogs } = useGetDeploymentLogsQuery(
		{ deploymentId: deployment?._id ?? lastDeployment?._id ?? "" },
		{ skip: !showBuild || (!deployment?._id && !lastDeployment?._id) }
	)

	useEffect(() => {
		if (initialLogs?.length) {
			dispatch(addLogs(initialLogs))
		}
		return () => { dispatch(clearLogs()) }
	}, [initialLogs, dispatch])
	useDeploymentSSE(project, refetch, sseActive, setSseActive, tempDeployment)

	const reDeploy = async () => {
		if (!project || (!deployment && !lastDeployment)) return
		dispatch(
			projectApis.util.updateQueryData(
				"getProjectById",
				{ id: project._id, params: { include: "user" } },
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




	if (isLoading) return <ProjectLoading />
	if (isError) return <ErrorComponent error={error} id={projectId} field="Project" />
	if (!project) {
		return (
			<ErrorComponent error={{ message: "project not found" }} id={projectId} field="Project" />
		)
	}



	return (
		<ProjectContent
			project={project}
			deployment={deployment}
			tempDeployment={tempDeployment}
			lastDeployment={lastDeployment}
			tabFromUrl={tab}
			refetch={refetch}
			reDeploy={reDeploy}
			showBuild={showBuild}
			setShowBuild={setShowBuild}
			onCreateDeployment={handleCreateDeployment}
			refetchLogs={refetchLogs}
		/>
	)
}
