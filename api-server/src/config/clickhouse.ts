import { createClient } from "@clickhouse/client";

export const client = createClient({
	url: process.env.CLICKHOUSE_HOST_URL_WITH_PORT as string,
	//https://wsjhizz301.ap-south-1.aws.clickhouse.cloud:8443
	username: process.env.CLICKHOUSE_USERNAME as string,
	password: process.env.CLICKHOUSE_PASSWORD as string,
	compression: {
		request: true,
		response: true,
	},
	max_open_connections: 10,
});
