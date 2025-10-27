export interface Log {
	event_id: string;
	level: string;
	deployment_id: string;
	project_id: string;
	message: string;
	timestamp: Date | string
}