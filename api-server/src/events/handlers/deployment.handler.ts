import { deploymentService, logsService } from "../../instances.js"
import { DeploymentLogEvent, DeploymentUpdatesEvent } from "../schemas/deployment.schema.js"
import { UpdateTypes } from "../types/event.js"

class DeploymentEventHandler {
	static async handleLogs(event: DeploymentLogEvent): Promise<void> {
		//service call
		const { data } = event
		console.log("returnings")

		const { log, deploymentId, projectId } = data
		const r = await logsService.__insertLog(log.message, projectId, deploymentId, new Date(log.timestamp), log.level)
		console.log("logs inserted...", r)
		//stream
	}

	static async handleUpdates(event: DeploymentUpdatesEvent): Promise<void> {
		//service call
		const { data } = event
		const { updates, deploymentId, projectId } = data
		switch (data.updateType) {
			case UpdateTypes.START: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					commit_hash: updates.commit_hash
				})
				console.log("updates event ==>>>", data.updateType)
				break
			}
			case UpdateTypes.END: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					complete_at: new Date(updates.complete_at || ""),
					duration_ms: updates.duration_ms
				})
				console.log("updates event ==>>>", data.updateType)
				break
			}
			case UpdateTypes.ERROR: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					error_message: updates.error_message
				})
				console.log("updates event ==>>>", data.updateType)
				break
			}
			case UpdateTypes.CUSTOM: {
				await deploymentService.__updateDeployment(projectId, deploymentId, {
					status: updates.status,
					...updates,
					complete_at: new Date()
				})
				console.log("updates event ==>>>", data.updateType)
				break
			}
			default: {
				console.log("Undefined Update type")
			}
		}
	}
}

export default DeploymentEventHandler