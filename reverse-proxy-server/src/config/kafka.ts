import { Kafka } from "kafkajs";

export const kafka = new Kafka({
	clientId: `reverse-proxy-server`,
	brokers: process.env.KAFKA_BROKERS?.split(",").filter(Boolean) as string[],
	ssl: {
		ca: process.env.KAFKA_CA?.replace(/\\n/g, "\n")
	},
	sasl: {
		mechanism: "plain",
		username: process.env.KAFKA_USERNAME as string,
		password: process.env.KAFKA_PASSWORD as string,
	},
});
