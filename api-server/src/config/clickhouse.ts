import { createClient } from "@clickhouse/client";

export const client = createClient({
	url: "https://clickhouse-3bad4267-amal446446-e615.k.aivencloud.com:14640",
	//https://wsjhizz301.ap-south-1.aws.clickhouse.cloud:8443
	username: process.env.CLICKHOUSE_USERNAME as string,
	password: process.env.CLICKHOUSE_PASSWORD as string,
});
