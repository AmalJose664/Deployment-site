export interface IAnalytics {
	projectId: string;
	subdomain: string;
	path: string;
	statusCode: number;
	responseTime: number;
	requestSize: number;
	responseSize: number;
	ip: string;
	ua?: string;
	isBot?: boolean;
	referer?: string;
	timestamp: string;
	error?: string;
}