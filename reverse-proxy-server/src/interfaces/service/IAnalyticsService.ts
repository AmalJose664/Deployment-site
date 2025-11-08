import { IAnalytics } from "../../models/Analytics.js";

export interface IAnalyticsService {
	sendAnalytics(data: IAnalytics): void
	sendAnalyticsBatch(): Promise<void>
	queueAnalytics(data: IAnalytics): void
	cleanService(): Promise<void>
}