import { ResponseJSON, ResultSet } from "@clickhouse/client";
import { ILogRepository } from "../interfaces/repository/ILogRepository.js";
import { ILogsService } from "../interfaces/service/ILogsService.js";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import AppError from "../utils/AppError.js";

class LogsService implements ILogsService {
	private logsRepository: ILogRepository
	private deploymentRepository: IDeploymentRepository;

	constructor(logRepo: ILogRepository, depRepo: IDeploymentRepository) {
		this.logsRepository = logRepo
		this.deploymentRepository = depRepo
	}
	async getDeploymentLog(deploymentId: string, userId: string): Promise<ResponseJSON<unknown>> {

		const deployment = this.deploymentRepository.findDeploymentById(deploymentId, userId)
		if (!deployment) {
			throw new AppError("Deployment not found ", 404)
		}
		return await this.logsRepository.getLogs(deploymentId)
	}
	async getProjectsLogs(projectId: string, userId: string): Promise<ResponseJSON<unknown>> {

		return await this.logsRepository.getProjectLogs(projectId)

	}

	async __insertLog(log: string, projectId: string, deploymentId: string, reportTime: Date, info: string): Promise<void> {
		await this.logsRepository.__insertLogs({ deploymentId, log, projectId, reportTime, info })
	}

}

export default LogsService