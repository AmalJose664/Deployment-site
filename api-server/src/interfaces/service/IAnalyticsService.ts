import { BufferAnalytics, IAnalytics } from "../../models/Analytics.js";
import { queryOptions } from "../repository/IAnalyticsRepository.js";

export interface IAnalyticsService {
    saveBatch(): Promise<void>;
    addEvent(event: BufferAnalytics): Promise<void>;
    addEventBatch(event: BufferAnalytics[]): Promise<void>;
    exitService(): Promise<void>;

    getBandwidthData(projectId: string, range: string, interval: string): Promise<[unknown[], queryOptions]>;
    getOverView(projectId: string, range: string, interval: string): Promise<[unknown[], queryOptions]>;
    getRealtime(projectId: string, interval: string): Promise<[unknown[], queryOptions]>;
    getTopPages(projectId: string, interval: string, limit: number): Promise<[unknown[], queryOptions]>;
    getOsStats(projectId: string, interval: string): Promise<[unknown[], queryOptions]>;
}
