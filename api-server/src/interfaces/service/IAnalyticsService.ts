import { BufferAnalytics, IAnalytics } from "../../models/Analytics.js"

export interface IAnalyticsService {

	saveBatch(): Promise<void>
	addEvent(event: BufferAnalytics): Promise<void>
	addEventBatch(event: BufferAnalytics[]): Promise<void>
	exitService(): Promise<void>
}