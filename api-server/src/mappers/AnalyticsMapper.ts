import { queryOptions } from "../interfaces/repository/IAnalyticsRepository.js";
type meta = Record<string, string | number>;
interface bandWidthType {
	date: string;
	requestMB: number;
	responseMB: number;
	totalMB: number;
}
interface trafficOverview {
	date: string
	requests: number,
	uniqueVisitors: number,
	avgResponseTime: number,
	totalBandwidthMb: number
}

export class AnalyticsMapper {
	static bandwidthResponseDTO(data: unknown[], projectId: string, meta: queryOptions): {
		projectId: string, data: bandWidthType[]
		meta: meta
	} {
		return {
			projectId,
			data: data.map((d: any) => ({
				date: d.time,
				requestMB: parseFloat(d.request_mb.toFixed(2)),
				responseMB: parseFloat(d.response_mb.toFixed(2)),
				totalMB: parseFloat(d.total_mb.toFixed(2)),
			})),
			meta: { ...meta, total: data.length } as unknown as meta
		}
	}

	static overviewResponse(data: unknown[], projectId: string, meta: queryOptions): {
		projectId: string, data: trafficOverview[]
		meta: meta
	} {

		return {
			projectId,
			data: data.map((d: any) => ({
				date: d.time,
				avgResponseTime: parseFloat(d.avg_response_time.toFixed(2)),
				uniqueVisitors: Number(d.unique_visitors),
				requests: Number(d.requests),
				totalBandwidthMb: parseFloat(d.total_bandwidth_mb.toFixed(2)),
			})),
			meta: { ...meta, total: data.length } as unknown as meta
		}
	}
}