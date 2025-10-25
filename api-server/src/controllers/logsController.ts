import { Request, Response, NextFunction } from "express";
import { logsService } from "../instances.js";
import { ILogsController } from "../interfaces/controller/ILogsController.js";
import { ILogsService } from "../interfaces/service/ILogsService.js";
import { client } from "../config/clickhouse.js";

class LogsController implements ILogsController {

	private logsService: ILogsService
	constructor(logsService: ILogsService) {
		this.logsService = logsService
	}

	async getLogsByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
		const projectId = req.params.projectId
		const result = await logsService.getProjectsLogs(projectId)

		const { data } = result

		res.json({ hey: data.map((d: any) => d.log) })
		return
	}
	async getLogsByDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		const deploymentId = req.params.deploymentId
		const result = await logsService.getDeploymentLog(deploymentId)

		const { data } = result

		res.json({ hey: data.map((d: any) => d.log) })
		return
	}
	async test(req: Request, res: Response, next: NextFunction): Promise<void> {

		const result = await client.query({
			query: `SELECT * FROM "log_events" ORDER BY "report_time" ASC LIMIT 31 OFFSET 0;`,

			format: "JSON"
		})


		console.log(await result.stream())
		res.json({ hey: "data.map((d: any) => d.log)" })
		return
	}
}

export default LogsController;
