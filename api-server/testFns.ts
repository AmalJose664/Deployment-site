import { Kafka } from "kafkajs";
import { Deployment } from "./src/models/Deployment";
import { Project } from "./src/models/Projects";
import repo from "./src/repositories/project.repository";
import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";
import pg from "pg"; // COnsider  ------------------------------------------------------------------------------
import { User } from "./src/models/User";

import { client } from "./src/config/clickhouse";
import { EVENT_REGISTRY } from "./src/events/regitry"

async function mongodbData() {
	try {
		await connectDb();
		// await Project.updateOne({ _id: "68fb1ccb10b93de245fa9f55" }, { deployments: [] })
		console.log(await Project.deleteOne({ name: "new-ui-projectsqq" }));
		// const r = await new repo().pullDeployments("68fa78e47e6c4401f35402d8", "68e4a04f1e57fa3fe5b1a81e", "68fa79c47e6c4401f35402f2")

		// await mongoose.disconnect()
	} catch (error) {
		console.log(error);
	} finally {
		process.exit(0);
	}
}
// mongodbData()


async function commitAllMessages() {
	const kafka = new Kafka({
		clientId: `api-server`,
		brokers: ["pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092"],
		ssl: true,
		sasl: {
			mechanism: "plain",
			username: process.env.KAFKA_USERNAME as string,
			password: process.env.KAFKA_PASSWORD as string,
		},
	});

	const topic = "deployment.logs";
	const groupId = "vercel-api-clone";
	const admin = kafka.admin();
	await admin.connect();

	try {
		const topicMetadata = await admin.fetchTopicMetadata({ topics: [topic] });
		const partitions = topicMetadata.topics[0].partitions.map((p) => p.partitionId);

		const endOffsets = await admin.fetchTopicOffsets(topic);

		const offsetsToCommit = endOffsets.map(({ partition, offset }) => ({
			topic,
			partition,
			offset,
		}));

		await admin.setOffsets({ groupId, topic, partitions: offsetsToCommit });
		console.log("configs====>>>>>>>", { partitions });
		console.log(`✅ All uncommitted messages marked as consumed for group "${groupId}" on topic "${topic}".`);
	} catch (err) {
		console.error("❌ Error committing offsets:", err);
	} finally {
		await admin.disconnect();
	}
}
// commitAllMessages();


async function getClickhouseData() {
	const data = await client.query({
		query: `SELECT * FROM log_events  ORDER BY "report_time" ASC`,

		format: "JSON",
	})
	const datas = await data.json()
	false && await client.query({
		query: "TRUNCATE log_events"
	})

	console.log(datas)
}
// getClickhouseData()
