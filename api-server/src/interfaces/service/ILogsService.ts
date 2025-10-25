import { ResponseJSON, ResultSet } from "@clickhouse/client";

export interface ILogsService {
	getDeploymentLog(deploymentId: string): Promise<ResponseJSON<unknown>>
	getProjectsLogs(projectId: string): Promise<ResponseJSON<unknown>>
	__insertLog(log: string, projectId: string, deploymentId: string, reportTime: Date, info: string): Promise<void>
} 