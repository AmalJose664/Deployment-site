import { analyticsService } from "../../instances.js"
import { AnalyticsEvent } from "../schemas/analytics.schema.js"

class ProjectAnalyticsHandler {

	static async handleDataBatch(data: AnalyticsEvent[]) {

		analyticsService.addEventBatch(data)
	}
	static async handleDataSinlge(data: AnalyticsEvent) {

		analyticsService.addEvent(data)
	}

}


export default ProjectAnalyticsHandler