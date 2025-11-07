export interface ILogs {
	event_id: string;
	level: string;
	message: string;
	timestamp: Date | string;
	deployment_id: string;
	project_id: string;
	stream: string;
}

// Table query

/**
 * 
 *
 * 
 *  CREATE TABLE  log_events
(
	event_id UUID DEFAULT generateUUIDv4(),
	deployment_id Nullable(String),
	project_id Nullable(String),
	log String,
	info String,
	report_time DateTime('UTC'),
	metadata Nullable(String)
)
ENGINE = MergeTree
ORDER BY (report_time, project_id)

 * 
 *
 *  
*/
