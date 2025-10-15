import { Consumer, EachBatchPayload, Kafka, Offsets } from "kafkajs";
import { getALlTopics } from "./regitry.js";
import { IKafkaEventConsumer } from "../interfaces/consumers/IKafkaEventConsumer.js";

class KafkaEventConsumer implements IKafkaEventConsumer {
	private kafka: Kafka
	private consumer: Consumer
	private isRunning = false

	constructor(kafka: Kafka) {
		this.kafka = kafka
		this.consumer = this.kafka.consumer({ groupId: "vercel-api-clone" })
	}
	async start() {
		if (this.isRunning) {
			console.log("Kafka already running")
			return
		}
		try {
			await this.consumer.connect();
			console.log('🔌 Kafka consumer connected');

			const topics = getALlTopics();
			await this.consumer.subscribe({ topics });
			console.log(`📡 Subscribed to ${topics.length} topics:`, topics);

			await this.consumer.run({
				autoCommit: false,
				eachBatch: this.processEvent.bind(this),
			});

			this.isRunning = true;
			console.log('Kafka consumer started successfully');
		} catch (error) {
			console.error('Failed to start Kafka consumer:', error);
			throw error;
		}

	}
	async stop(): Promise<void> {
		if (!this.isRunning) {
			return;
		}

		try {
			await this.consumer.disconnect();
			this.isRunning = false;
			console.log('Kafka consumer stopped');
		} catch (error) {
			console.error('Error stopping Kafka consumer:', error);
			throw error;
		}
	}


	private async processEvent({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }: EachBatchPayload): Promise<void> {
		try {
			console.log("New Kafka message ...")
			const messages = batch.messages
			for (const msg of messages) {
				const stringMessage = msg.value?.toString()
				const data = JSON.parse(stringMessage || "{}")



				// next fn
				commitOffsetsIfNecessary(msg.offset as unknown as Offsets)
				resolveOffset(msg.offset)
				await heartbeat()
			}
		} catch (error) {

		}
	}
}

export default KafkaEventConsumer