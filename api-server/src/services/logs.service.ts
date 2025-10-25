import { ResponseJSON, ResultSet } from "@clickhouse/client";
import { ILogRepository } from "../interfaces/repository/ILogRepository.js";
import { ILogsService } from "../interfaces/service/ILogsService.js";

class LogsService implements ILogsService {
	private logsRepository: ILogRepository
	constructor(logRepo: ILogRepository) {
		this.logsRepository = logRepo
	}
	async getDeploymentLog(deploymentId: string): Promise<ResponseJSON<unknown>> {
		return await this.logsRepository.getLogs(deploymentId)
	}
	async getProjectsLogs(projectId: string): Promise<ResponseJSON<unknown>> {
		return await this.logsRepository.getProjectLogs(projectId)
	}

	async __insertLog(log: string, projectId: string, deploymentId: string, reportTime: Date, info: string): Promise<void> {
		await this.logsRepository.__insertLogs({ deploymentId, log, projectId, reportTime, info })
	}

}

export default LogsService