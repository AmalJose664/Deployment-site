import { BufferAnalytics, IAnalytics } from "../../models/Analytics.js";

export interface IAnalyticsRepository {
	insertBatch(data: BufferAnalytics[]): Promise<void>
	insertSingle(data: BufferAnalytics): Promise<void>
}