import { analyticsService } from "../service/analytics.service.js"

export const analyticsClean = async () => {
	await analyticsService.cleanService()

}