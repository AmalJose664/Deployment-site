import { ENVS } from "@/config/env.config.js";
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
	clientId: `api-server`,
	brokers: ENVS.KAFKA_BROKERS.split(",").filter(Boolean),
	ssl: {
		ca: ENVS.KAFKA_CA
	},
	sasl: {
		mechanism: "plain",
		username: ENVS.KAFKA_USERNAME as string,
		password: ENVS.KAFKA_PASSWORD as string,
	},
	retry: {
		retries: 8,
		restartOnFailure: async () => {
			process.stdout.write("   ---- kafka retry ----   ");
			return true;
		},
	},
});
