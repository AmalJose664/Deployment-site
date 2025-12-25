import http from "http";
import https from "https";

export const httpAgent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 30000,
	maxSockets: 50,
	maxFreeSockets: 10,
});

export const httpsAgent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 30000,
	maxSockets: 50,
	maxFreeSockets: 10,
});

export const proxyTimeouts = {
	proxyTimeout: 30000,
	timeout: 60000,
};

