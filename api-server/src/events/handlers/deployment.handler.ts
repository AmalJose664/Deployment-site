
class DeploymentEventHandler {
	static async handleLogs(event: any): Promise<void> {
		//service call
		console.log("log handler  ", event)
	}

	static async handleStatusChange(event: any): Promise<void> {
		//service call
		console.log("log handler status change  ", event)
	}
}

export default DeploymentEventHandler