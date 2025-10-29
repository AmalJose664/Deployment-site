import { ResponseJSON, ResultSet } from "@clickhouse/client"

export interface LogModel {
	info: string
	log: string
	deploymentId: string
	projectId: string
	reportTime: Date
}
export interface ILogRepository {
	getProjectLogs(deploymentId: string, page: number, limit: number): Promise<ResponseJSON<unknown>>
	getLogs(projectId: string, page: number, limit: number): Promise<ResponseJSON<unknown>>
	__insertLogs(data: LogModel): Promise<void>
}