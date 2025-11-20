import { analyticsService } from "../../instances.js";
import { BufferAnalytics } from "../../models/Analytics.js";

class ProjectAnalyticsHandler {
    static async handleDataBatch(data: BufferAnalytics[]) {
        analyticsService.addEventBatch(data);
    }
    static async handleDataSinlge(data: BufferAnalytics) {
        analyticsService.addEvent(data);
    }
}

export default ProjectAnalyticsHandler;
