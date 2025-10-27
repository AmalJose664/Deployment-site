import { Request, Response, NextFunction } from "express";
import { logsService } from "../instances.js";
import { ILogsController } from "../interfaces/controller/ILogsController.js";
import { ILogsService } from "../interfaces/service/ILogsService.js";
import { client } from "../config/clickhouse.js";
import { deploymentEmitter } from "../events/deploymentEmitter.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { generateSlug } from "random-word-slugs";

class LogsController implements ILogsController {

	private logsService: ILogsService
	constructor(logsService: ILogsService) {
		this.logsService = logsService
	}

	async getLogsByProject(req: Request, res: Response, next: NextFunction): Promise<void> {

		try {
			const projectId = req.params.projectId
			const user = req.user?.id as string
			const result = await this.logsService.getProjectsLogs(projectId, user)

			const { data } = result

			res.json({ hey: data.map((d: any) => d.log) })
			return
		} catch (error) {
			next(error);
		}
	}
	async getLogsByDeployment(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deploymentId = req.params.deploymentId
			const user = req.user?.id as string
			const result = await this.logsService.getDeploymentLog(deploymentId, user)

			const { data } = result

			res.json({ hey: data.map((d: any) => d.log), length: data.length })
			return
		} catch (error) {
			next(error)
		}
	}

	async streamLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.deploymentId
		try {

			res.setHeader('Content-Type', 'text/event-stream');
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Connection', 'keep-alive');
			res.write(`data: ${JSON.stringify({ message: 'Connected to logs' })}\n\n`);

			const responseHandler = (log: any) => {
				if (!res.writableEnded) {
					console.log("sending...", deploymentEmitter.eventNames())

					res.write(`data: ${JSON.stringify(log)}\n\n`);
				}
			};
			deploymentEmitter.onLog(id, responseHandler)
			deploymentEmitter.onUpdate(id, responseHandler)


			req.on('close', () => {
				if (!res.writableEnded) {
					res.write('event: close\ndata: {"status":"complete"}\n\n');
					res.end();
				}
				deploymentEmitter.offLog(id, responseHandler)
				deploymentEmitter.onUpdate(id, responseHandler)
				console.log('Client disconnected');
			});
		} catch (error) {
			deploymentEmitter.offAll(id)
			next(error)
		}
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
