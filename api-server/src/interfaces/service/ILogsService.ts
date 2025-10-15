import { ResultSet } from "@clickhouse/client";

export interface ILogsService {
	getDeploymentLog(deploymentId: string): Promise<ResultSet<"JSON">>
	getProjectsLogs(projectId: string): Promise<ResultSet<"JSON">>
	__insertLog(log: string, projectId: string, deploymentId: string, reportTime: Date, info: string): Promise<void>
} 