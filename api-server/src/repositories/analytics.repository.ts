import { ClickHouseClient } from "@clickhouse/client";
import { IAnalyticsRepository, queryOptions } from "../interfaces/repository/IAnalyticsRepository.js";
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




	async getBandwidth(projectId: string, queryOptions: queryOptions): Promise<unknown[]> {
		const result = await this.client.query({
			query: `SELECT 
          	toStartOfInterval(
            toTimeZone(timestamp, 'Asia/Kolkata'), 
            INTERVAL {interval:UInt32} ${queryOptions.intervalUnit}
          	) as time,
          	sum(request_size) / 1024 / 1024 as request_mb,
          	sum(response_size) / 1024 / 1024 as response_mb,
          	(sum(request_size) + sum(response_size)) / 1024 / 1024 as total_mb
        	FROM analytics
        	WHERE project_id = {projectId:String}
          	AND timestamp >= now() - INTERVAL  {range:UInt32} ${queryOptions.rangeUnit}
        	GROUP BY time
        	ORDER BY time
      `,

			query_params: {
				projectId,
				range: queryOptions.range,
				interval: queryOptions.interval,
			},
			format: 'JSONEachRow'
		})

		return await result.json()
	}
	async getOverview(projectId: string, queryOptions: queryOptions): Promise<unknown[]> {
		console.log(queryOptions)
		const result = await this.client.query({
			query: `SELECT
  			toStartOfInterval(
    		toTimeZone(timestamp, 'Asia/Kolkata'),
    		INTERVAL {interval:UInt32} ${queryOptions.intervalUnit}
  			) as time,
  			count() as requests,
  			uniq(ip) as unique_visitors,
  			avg(response_time) as avg_response_time,
  			(SUM(request_size) + SUM(response_size)) / 1024 / 1024 as total_bandwidth_mb
			FROM analytics
			WHERE project_id = {projectId:String}
  			AND timestamp >= now() - INTERVAL {range:UInt32} ${queryOptions.rangeUnit}
			GROUP BY time
			ORDER BY time`,

			query_params: {
				projectId,
				range: queryOptions.range,
				interval: queryOptions.interval,
			},
			format: 'JSONEachRow'
		})

		return await result.json()

	}
	async getRealtime(projectId: string, queryOptions: queryOptions): Promise<unknown[]> {
		console.log(queryOptions)
		const result = await this.client.query({
			query: `SELECT 
    		count() as total_requests,
    		countIf(status_code >= 400) as errors,
    		countIf(status_code < 400) as successful,
    		avg(response_time) as avg_response_time,
    		quantile(0.95)(response_time) as p95_response_time,
    		sum(response_size) as total_bandwidth,
    		uniq(ip) as active_users
			FROM analytics
			WHERE project_id = {projectId:String}
  			AND timestamp >= now() - INTERVAL {interval:UInt32} ${queryOptions.intervalUnit}`,

			query_params: {
				projectId,
				interval: queryOptions.interval,
			},
			format: 'JSONEachRow'
		})

		return await result.json()

	}
}

export default AnalyticsRepository