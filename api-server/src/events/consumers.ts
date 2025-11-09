import { Consumer, EachBatchPayload, Kafka, Offsets } from "kafkajs";
import { getAllTopics, getEventConfig, getEventProcessFn, getEventSchema, } from "./regitry.js";
import { IKafkaEventConsumer } from "../interfaces/consumers/IKafkaEventConsumer.js";


class KafkaEventConsumer implements IKafkaEventConsumer {
	private kafka: Kafka;
	private logsConsumer: Consumer;
	private analyticsConsumer: Consumer;
	private isRunning = false;

	constructor(kafka: Kafka) {
		this.kafka = kafka;
		this.logsConsumer = this.kafka.consumer({ groupId: "vercel-logs-group" });
		this.analyticsConsumer = this.kafka.consumer({ groupId: "vercel-analytics-group" });
	}
	async start() {
		if (this.isRunning) {
			console.log("Kafka already running");
			return;
		}
		try {
			await this.logsConsumer.connect();
			await this.analyticsConsumer.connect();
			console.log("🔌 Kafka consumers connected");

			const [logsTopics, analyticsTopics] = getAllTopics();
			await this.logsConsumer.subscribe({ topics: logsTopics });
			await this.analyticsConsumer.subscribe({ topics: analyticsTopics });
			console.log(`📡 Subscribed to topics:`, [...logsTopics, ...analyticsTopics]);

			await this.logsConsumer.run({
				autoCommit: false,
				eachBatch: this.processLogsEvent.bind(this),
			});
			await this.analyticsConsumer.run({
				autoCommit: true,
				eachBatch: this.processAnalyticsEvent.bind(this),
			});

			this.isRunning = true;
			console.log("Kafka consumers started successfully");
		} catch (error) {
			console.error("Failed to start Kafka consumers:", error);
			throw error;
		}
	}
	async stop(): Promise<void> {
		if (!this.isRunning) {
			return;
		}

		try {
			await this.logsConsumer.disconnect();
			await this.analyticsConsumer.disconnect();
			this.isRunning = false;
			console.log("Kafka consumer stopped");
		} catch (error) {
			console.error("Error stopping Kafka consumer:", error);
			throw error;
		}
	}

	private async processLogsEvent({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }: EachBatchPayload): Promise<void> {
		const processFn = getEventProcessFn(batch.topic, "logs")
		await Promise.all(
			batch.messages.map(async (msg) => {
				try {
					const data = JSON.parse(msg.value?.toString() || "{}") as {};

					await processFn(data, batch.topic, "logs");
					resolveOffset(msg.offset);

				} catch (error: any) {
					console.error("Failed to process message:", error); // send to dlq task!!!!!
					resolveOffset(msg.offset);
				}

				commitOffsetsIfNecessary(msg.offset as unknown as Offsets);
				await heartbeat();
			}),
		);
	}

	private async processAnalyticsEvent({ batch }: EachBatchPayload): Promise<void> {
		const schema = getEventSchema(batch.topic, "analytics")
		const processFn = getEventProcessFn(batch.topic, "analytics")
		const events = batch.messages
			.map(msg => {
				try {
					const data = JSON.parse(msg.value?.toString() || "{}");
					return schema.parse(data)
				} catch (error) {
					console.error("Failed to parse analytics message:", error);
					return null;
				}
			}).filter(Boolean)

		try {
			await processFn(events, batch.topic, "analytics")
		} catch (error) {
			console.error("Failed to process analytics batch:", error);

		}
	}
}

export default KafkaEventConsumer;
