export interface ResponseJSON<T> {
	data: T[];
	total?: number;
	[key: string]: any;
}
export interface LogResult {
	event_id: string;
	deployment_id: string;
	log: string;
	metedata: null;
	project_id: string;
	report_time: string;
	info: "INFO" | "SUCCESS" | "WARN" | "ERROR";
}
export interface toLogResponseDTO {
	log: {
		event_id: string;
		level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
		deployment_id: string;
		project_id: string;
		message: string;
		timestamp: Date | string;
	};
}
interface toLogsResponseDTO {
	logs: toLogResponseDTO["log"][];
	total: number;
}
export class LogMapper {
	static toLogResponse(log: LogResult): toLogResponseDTO {
		return {
			log: {
				deployment_id: log.deployment_id,
				project_id: log.project_id,
				event_id: log.event_id,
				level: log.info,
				message: log.log,
				timestamp: log.report_time,
			},
		};
	}
	static toLogsResponse(logs: ResponseJSON<unknown>["data"], total: number): toLogsResponseDTO {
		return {
			logs: logs.map((log) => this.toLogResponse(log as LogResult).log),
			total,
		};
	}
}
