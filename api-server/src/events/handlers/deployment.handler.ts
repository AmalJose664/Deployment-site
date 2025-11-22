import { deploymentService, logsService, projectService } from "../../instances.js";
import { ProjectStatus } from "../../models/Projects.js";
import { deploymentEmitter } from "../deploymentEmitter.js";
import { DeploymentLogEvent, DeploymentUpdatesEvent } from "../schemas/deployment.schema.js";
import { UpdateTypes } from "../types/event.js";

class DeploymentEventHandler {
	static async handleLogs(event: DeploymentLogEvent): Promise<void> {
		//service call
		const { data } = event;

		const { log, deploymentId, projectId } = data;
		deploymentEmitter.emitLog(deploymentId, {
			event_id: event.eventId,
			deployment_id: deploymentId,
			project_id: projectId,
			...log,
		});
		console.log("logs inserted...", log.message);
		return
		await logsService.__insertLog(log.message, projectId, deploymentId, new Date(log.timestamp), log.level);
		//stream
	}

	static async handleUpdates(event: DeploymentUpdatesEvent): Promise<void> {
		//service call
		const { data } = event;
		const { updates, deploymentId, projectId } = data;
		console.log("Updates >>>>", data.updateType);
		deploymentEmitter.emitUpdates(deploymentId, {
			...updates,
			deploymentId,
			projectId,
		});
		return
		switch (data.updateType) {
			case UpdateTypes.START: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					commit_hash: updates.commit_hash,
				});
				await projectService.__updateProjectById(projectId, {
					status: updates.status as unknown as ProjectStatus,
				});
				break;
			}
			case UpdateTypes.END: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					complete_at: new Date(updates.complete_at || ""),
					install_ms: updates.install_ms,
					build_ms: updates.build_ms,
					duration_ms: updates.duration_ms,
					file_structure: {
						files: updates.file_structure?.files || [],
						totalSize: updates.file_structure?.totalSize || 0,
					},
				});
				await projectService.__updateProjectById(projectId, {
					status: updates.status as unknown as ProjectStatus,
					techStack: updates.techStack,
					tempDeployment: null,
					...(updates.status === "READY" && { currentDeployment: deploymentId }),
				});
				break;
			}
			case UpdateTypes.ERROR: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					error_message: updates.error_message,
				});
				await projectService.__updateProjectById(projectId, {
					status: updates.status as unknown as ProjectStatus,
					tempDeployment: null,
				}, { updateStatusOnlyIfNoCurrentDeployment: true });
				break;
			}
			case UpdateTypes.CUSTOM: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					...updates,
					complete_at: new Date(updates.complete_at || ""),
				});
				await projectService.__updateProjectById(projectId, {
					status: updates.status as unknown as ProjectStatus,
					techStack: updates.techStack,
				});
				break;
			}
			default: {
				console.log("Undefined Update type");
			}
		}
	}
}

export default DeploymentEventHandler;
