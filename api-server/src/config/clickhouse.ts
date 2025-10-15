import { createClient } from "@clickhouse/client";

export const client = createClient({
    url: "https://wsjhizz301.ap-south-1.aws.clickhouse.cloud:8443",
    username: process.env.CLICKHOUSE_USERNAME as string,
    password: process.env.CLICKHOUSE_PASSWORD as string,
});
