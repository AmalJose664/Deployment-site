import { Request, Response, NextFunction } from "express";
import { ILogsController } from "../interfaces/controller/ILogsController.js";
import { ILogsService } from "../interfaces/service/ILogsService.js";
import { client } from "../config/clickhouse.js";
import { deploymentEmitter, sseManager } from "../events/deploymentEmitter.js";
import { v4 } from "uuid";
import { LogMapper } from "../mappers/LogsMapper.js";

class LogsController implements ILogsController {

	private logsService: ILogsService
	constructor(logsService: ILogsService) {
		this.logsService = logsService
	}

	async getLogsByProject(req: Request, res: Response, next: NextFunction): Promise<void> {

		try {
			const projectId = req.params.projectId
			const user = req.user?.id as string
			const result = await this.logsService.getProjectsLogs(projectId, user, {})

			const response = LogMapper.toLogsResponse(result.logs, result.total)
			res.json(response)
			return
		} catch (error) {
			next(error);
		}
	}
	async getLogsByDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deploymentId = req.params.deploymentId
			const user = req.user?.id as string
			const result = await this.logsService.getDeploymentLog(deploymentId, user, {})

			const response = LogMapper.toLogsResponse(result.logs, result.total)
			res.json(response)
			return
		} catch (error) {
			next(error)
		}
	}

	async streamLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.deploymentId
		try {

			sseManager.addClient(v4(), id, res, req)

		} catch (error) {
			deploymentEmitter.offAll(id)
			next(error)
		}
	}

	async getData(req: Request, res: Response, next: NextFunction): Promise<void> {

		res.json({
			clientCount: sseManager.getClientCount(),
			listerCount: sseManager.getListeners(),
			listerners: sseManager.getEventFns()
		})

	}
	async test(req: Request, res: Response, next: NextFunction): Promise<void> {

		const result = await client.query({
			query: `SELECT * FROM "log_events" ORDER BY "report_time" ASC LIMIT 31 OFFSET 0;`,

			format: "JSON"
		})

		res.json({ hey: "data.map((d: any) => d.log)" })
		return
	}

}

export default LogsController;
