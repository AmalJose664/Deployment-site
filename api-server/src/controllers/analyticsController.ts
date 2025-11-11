import { Request, Response, NextFunction } from "express";
import { IAnalyticsController } from "../interfaces/controller/IAnalyticsController.js";
import { IAnalyticsService } from "../interfaces/service/IAnalyticsService.js";
import { AnalyticsMapper } from "../mappers/AnalyticsMapper.js";

class AnalyticsController implements IAnalyticsController {
	private analyticsService: IAnalyticsService

	constructor(analyticsService: IAnalyticsService) {
		this.analyticsService = analyticsService
	}
	async bandWidth(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { projectId } = req.params
		const { range, interval } = req.query

		try {
			const [data, queryOptions] = await this.analyticsService.getBandwidthData(projectId, range as string, interval as string)
			const response = AnalyticsMapper.bandwidthResponseDTO(data, projectId, queryOptions)

			res.json(response)
			return;
		} catch (error) {
			next(error);
		}
	}
	async overview(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { projectId } = req.params
		const { range, interval } = req.query

		try {
			const [data, queryOptions] = await this.analyticsService.getOverView(projectId, range as string, interval as string)
			const response = AnalyticsMapper.overviewResponse(data, projectId, queryOptions)

			res.json(response)
			return;
		} catch (error) {
			next(error);
		}
	}
}


export default AnalyticsController