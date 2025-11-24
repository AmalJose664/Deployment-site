import { analyticsService } from "../../instances.js";
import { BandWidthWithProjectType } from "../../interfaces/service/IAnalyticsService.js";
import { BufferAnalytics } from "../../models/Analytics.js";

class ProjectAnalyticsHandler {
	static async handleDataBatch(data: { events: BufferAnalytics[], bandwidthByProjectBatch: BandWidthWithProjectType }) {
		analyticsService.addEventBatch(data.events, data.bandwidthByProjectBatch);
	}
	static async handleDataSinlge(data: BufferAnalytics) {
		analyticsService.addEvent(data);
	}
}

export default ProjectAnalyticsHandler;
