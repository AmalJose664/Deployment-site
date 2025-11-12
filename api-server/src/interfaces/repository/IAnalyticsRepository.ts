import { BufferAnalytics, IAnalytics } from "../../models/Analytics.js";

export interface queryOptions {
	range?: number,
	rangeUnit?: string,
	interval?: number,
	intervalUnit?: string
	limit?: number
}
export interface IAnalyticsRepository {
	insertBatch(data: BufferAnalytics[]): Promise<void>
	insertSingle(data: BufferAnalytics): Promise<void>


	getBandwidth(projectId: string, queryOptions: queryOptions): Promise<unknown[]>
	getOverview(projectId: string, queryOptions: queryOptions): Promise<unknown[]>
	getRealtime(projectId: string, queryOptions: queryOptions): Promise<unknown[]>
	getTopPages(projectId: string, queryOptions: queryOptions): Promise<unknown[]>
	getOsStats(projectId: string, queryOptions: queryOptions): Promise<unknown[]>
}