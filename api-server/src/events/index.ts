import { kafka } from "../config/kafka.js";
import KafkaEventConsumer from "./consumer.js";

let consumerInstance: KafkaEventConsumer | null = null;

export async function startKafkaConsumer(): Promise<void> {
    consumerInstance = new KafkaEventConsumer(kafka);
    await consumerInstance.start();
}

export async function stopKafkaConsumer(): Promise<void> {
    if (consumerInstance) {
        await consumerInstance.stop();
    }
}
