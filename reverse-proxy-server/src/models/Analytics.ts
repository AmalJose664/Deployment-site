export interface IAnalytics {
	projectId: string;
	subdomain: string;
	path: string;
	statusCode: number;
	responseTime: number;
	requestSize: number;
	responseSize: number;
	ip: string;
	uaBrowser?: string
	uaOs?: string;
	isMobile?: boolean;
	isBot?: boolean;
	referer?: string;
	timestamp: string;
}