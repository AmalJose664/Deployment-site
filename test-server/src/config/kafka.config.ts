import { Kafka } from "kafkajs";

export const kafka = new Kafka({
	clientId: `api-server`,
	brokers: ["kafka-lynfera-renderstest446446-7987.f.aivencloud.com:11100"],
	ssl: {
		ca: process.env.KAFKA_CA?.replace(/\\n/g, "\n") as string,
	},
	sasl: {
		mechanism: "plain",
		username: process.env.KAFKA_USERNAME as string,
		password: process.env.KAFKA_PASSWORD as string,
	},
	retry: {
		retries: 8,
		restartOnFailure: async () => {
			process.stdout.write("   ---- kafka retry ----   ");
			return true;
		},
	},
});
