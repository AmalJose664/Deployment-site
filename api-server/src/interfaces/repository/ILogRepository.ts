import { ResponseJSON, ResultSet } from "@clickhouse/client"

export interface LogModel {
	info: string
	log: string
	deploymentId: string
	projectId: string
	reportTime: Date
}
export interface ILogRepository {
	getLogs(deploymentId: string): Promise<ResponseJSON<unknown>>
	getProjectLogs(projectId: string): Promise<ResponseJSON<unknown>>
	__insertLogs(data: LogModel): Promise<void>
}