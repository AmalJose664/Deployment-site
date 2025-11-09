import { IAnalytics } from "../../models/Analytics.js";

export interface IAnalyticsRepository {
	insertBatch(data: IAnalytics[]): Promise<void>
	insertSingle(data: IAnalytics): Promise<void>
}