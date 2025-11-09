import { ClickHouseClient } from "@clickhouse/client";
import { IAnalyticsRepository } from "../interfaces/repository/IAnalyticsRepository.js";
import { IAnalytics } from "../models/Analytics.js";

class AnalyticsRepository implements IAnalyticsRepository {
	private client: ClickHouseClient;

	constructor(client: ClickHouseClient) {
		this.client = client;
	}
	async insertBatch(data: IAnalytics[]): Promise<void> {
		console.log("data from repo, ", data[0].projectId, data.length)
	}
	async insertSingle(data: IAnalytics): Promise<void> {

	}
}

export default AnalyticsRepository