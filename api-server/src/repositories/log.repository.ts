import { v4 as uuidV4 } from "uuid";
import { ILogRepository, LogModel } from "../interfaces/repository/ILogRepository.js";
import { ClickHouseClient, ResponseJSON } from "@clickhouse/client"

class LogRepository implements ILogRepository {
	private client: ClickHouseClient
	constructor(client: ClickHouseClient) {
		this.client = client
	}

	async getProjectLogs(projectId: string): Promise<ResponseJSON<unknown>> {
		const result = await this.client.query({
			query: "SELECT * FROM log_events WHERE deployment_id={project_id:String}",
			query_params: {
				project_id: projectId,
			},
			format: "JSON"
		})

		return await result.json()
	}

	async getLogs(deploymentId: string): Promise<ResponseJSON<unknown>> {
		const result = await this.client.query({
			query: "SELECT * FROM log_events WHERE deployment_id={deployment_id:String}",
			query_params: {
				deployment_id: deploymentId,
			},
			format: "JSON"
		})
		return await result.json()
	}

	async __insertLogs(data: LogModel): Promise<void> {
		await this.client.insert(
			{
				table: "log_events",
				values: [{
					event_id: uuidV4(),
					info: data.info,
					deployment_id: data.deploymentId,
					project_id: data.projectId,
					log: data.log,
					report_time: data.reportTime.toISOString()
				}],
				format: "JSONEachRow"
			}
		)
	}
}
export default LogRepository