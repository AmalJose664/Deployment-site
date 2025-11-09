import { IAnalytics } from "../../models/Analytics.js"

export interface IAnalyticsService {

	saveBatch(): Promise<void>
	addEvent(event: IAnalytics): Promise<void>
	addEventBatch(event: IAnalytics[]): Promise<void>
	exitService(): Promise<void>
}