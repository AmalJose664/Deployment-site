import { ResultSet } from "@clickhouse/client"

export interface LogModel {
	info: string
	log: string
	deploymentId: string
	projectId: string
	reportTime: Date
}
export interface ILogRepository {
	getLogs(deploymentId: string): Promise<ResultSet<"JSON">>
	getProjectLogs(projectId: string): Promise<ResultSet<"JSON">>
	__insertLogs(data: LogModel): Promise<void>
}