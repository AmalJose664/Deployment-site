import { deployemntApis } from "@/store/services/deploymentApi";
import { projectApis } from "@/store/services/projectsApi";
import { addLog } from "@/store/slices/logSlice";
import { useAppDispatch } from "@/store/store";
import { Deployment, DeploymentUpdates } from "@/types/Deployment";
import { Log } from "@/types/Log";
import { Project, ProjectStatus } from "@/types/Project";
import { useEffect, useRef } from "react";
import { toast } from "sonner";


export function useDeploymentSSE(project: Project | undefined, refetch: () => void,
	deployment?: Deployment,) {
	const dispatch = useAppDispatch();
	const eventSourceRef = useRef<EventSource | null>(null)
	const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	useEffect(() => {
		if (!deployment?._id || !deployment.status) return
		if (eventSourceRef.current) return

		if (
			deployment.status !== ProjectStatus.BUILDING &&
			deployment.status !== ProjectStatus.QUEUED
		) {
			return
		}

		console.log("Starting SSE for deployment:", deployment._id)
		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/deployments/${deployment._id}/logs/stream`,
			{ withCredentials: true }
		)
		eventSourceRef.current = eventSource
		eventSource.onmessage = (event) => {
			try {
				const receivedData = JSON.parse(event.data)
				if (receivedData.type === "LOG") {
					dispatch(addLog(receivedData.data as Log))
				} else if (receivedData.type === "UPDATE") {
					const update = receivedData.data as DeploymentUpdates
					dispatch(
						deployemntApis.util.updateQueryData(
							"getDeploymentById",
							{ id: update.deploymentId, params: {} },
							(draft) => {
								Object.entries({
									status: update.status,
									commitHash: update.commit_hash,
									completedAt: update.complete_at,
									errorMessage: update.error_message,
								}).forEach(([key, value]: [string, any]) => {
									if (value) (draft as any)[key] = value
								})

								if (update.install_ms || update.build_ms || update.duration_ms) {
									draft.performance = {
										...draft.performance,
										...(update.install_ms && { installTime: update.install_ms }),
										...(update.build_ms && { buildTime: update.build_ms }),
										...(update.duration_ms && { totalDuration: update.duration_ms })
									}
								}
							}
						)
					)
					dispatch(
						projectApis.util.updateQueryData(
							"getProjectById",
							{ id: update.projectId, params: { include: "user" } },
							(draft) => {
								const newData = {
									status: update.status,
									...(update.techStack && { techStack: update.techStack }),
									...(update.status === ProjectStatus.READY && {
										currentDeployment: update.deploymentId,
										// tempDeployment: null
									})
								}
								Object.assign(draft, newData)
							}
						)
					)
					if (update.status === ProjectStatus.READY ||
						update.status === ProjectStatus.FAILED || update.status === ProjectStatus.CANCELED) {
						refreshTimerRef.current = setTimeout(() => {
							console.log("refeching...........")
							update.status === ProjectStatus.READY
								? toast.success("New Deployment resulted in Success 🎉🎉")
								: toast.error("New Deployment resulted in Failure")
							refetch()
						}, 1300)
						console.log("end here .... ... .")
					}
				}
			} catch (err) {
				console.error("parse error:  ", err)
			}
		}

		eventSource.onerror = (error) => {
			console.log(eventSource.readyState)
			if (eventSource.readyState === EventSource.CLOSED) {
				console.log('SSE connection closed by server');
				eventSource.close();
				eventSourceRef.current = null
				return;
			}
			if (eventSource.readyState === EventSource.CONNECTING) {
				console.log('SSE reconnecting...');
				return;
			}
			eventSourceRef.current = null
			console.log('SSE connection failed');
			eventSource.close();
		};

		eventSource.addEventListener("done", () => {
			eventSource.close();
			console.log('SSE connection closed by server');
			eventSourceRef.current = null
		})
		eventSource.addEventListener("close", () => {
			eventSource.close();
			console.log('SSE connection closed by server');
			eventSourceRef.current = null
		})

		return () => {
			eventSource.close(); eventSourceRef.current = null
			console.log("closed sse.............")
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
		}
	}, [deployment?._id, dispatch])
	return null
}