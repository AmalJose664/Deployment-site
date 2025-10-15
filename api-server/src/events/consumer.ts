import { Consumer, EachBatchPayload, Kafka, Offsets } from "kafkajs";
import { getALlTopics, processEvent } from "./regitry.js";
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
		const messages = batch.messages
		let attempt = 0;
		const maxRetries = 3
		const initialDelay = 750
		let processed = false

		for (const msg of messages) {
			async function processMessage() {
				while (!processed && attempt < maxRetries) {
					try {
						const stringMessage = msg.value?.toString()
						const data = JSON.parse(stringMessage || "{}")
						await processEvent(data, batch.topic)

						processed = true

					} catch (error: any) {
						attempt++;
						console.error(`Error processing message (attempt ${attempt}):`, {
							value: msg.value?.toString(),
							error: error.message,
						});
						if (attempt < maxRetries && !processed) {
							const baseDelay = initialDelay * 2 ** (attempt - 1);
							const jitter = Math.random() * 0.3 * baseDelay;
							const delay = Math.min(baseDelay + jitter, 30000);
							await new Promise((resolve) => setTimeout(resolve, delay))
						} else {
							console.log("Max retries reached skipping message")
						}
					}
				}


			}
			await processMessage()

			resolveOffset(msg.offset)
			commitOffsetsIfNecessary(msg.offset as unknown as Offsets)
			await heartbeat()
		}
	}

}

export default KafkaEventConsumer