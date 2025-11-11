import { ClickHouseClient } from "@clickhouse/client";
import { IAnalyticsRepository } from "../interfaces/repository/IAnalyticsRepository.js";
import { BufferAnalytics, } from "../models/Analytics.js";

class AnalyticsRepository implements IAnalyticsRepository {
	private client: ClickHouseClient;

	constructor(client: ClickHouseClient) {
		this.client = client;
	}
	async insertBatch(data: BufferAnalytics[]): Promise<void> {
		if (data.length === 0) return;
		const recordStartTime = performance.now();
		await this.client.insert({
			table: 'analytics',
			values: data,
			format: 'JSONEachRow',
			clickhouse_settings: {
				async_insert: 1,
				wait_for_async_insert: 0
			}
		});

		console.log(`Network time: ${(performance.now() - recordStartTime).toFixed(2)}ms`);
		console.log("data inserted from repo, ", data[0].project_id, data.length)

	}
	async insertSingle(data: BufferAnalytics): Promise<void> {
		this.insertBatch([data])
	}
}

export default AnalyticsRepository