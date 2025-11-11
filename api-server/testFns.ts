import "dotenv/config"
import { Kafka } from "kafkajs";
import { Deployment } from "./src/models/Deployment";
import { Project } from "./src/models/Projects";
import repo from "./src/repositories/project.repository";
import AnalyticsRepo from "./src/repositories/analytics.repository";

import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";

import { User } from "./src/models/User";

import { client } from "./src/config/clickhouse";
import { EVENT_REGISTRY } from "./src/events/regitry"
console.log('--------------------------------------------------------------------------------------------------------------')
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
	const insert = 2 === 2 + 3

	if (insert) {
		console.log("inserting....")
		const analyticsRepo = new AnalyticsRepo(client)
		await analyticsRepo.insertBatch([{
			project_id: "2174919898sa8da98",
			subdomain: "wooden-little-terabyte-5628",
			timestamp: new Date().getTime(),
			path: "/assets/index.js",
			request_size: Math.floor(Math.random() * 10000),
			response_size: Math.floor(Math.random() * 10000),
			response_time: Math.floor(Math.random() * 100),
			ip: "127.0.0.1",
			status_code: Math.floor(Math.random() * 100),
			ua_browser: "chrome",
			ua_os: "windows",
			is_mobile: 1,
			is_bot: 0,
			referer: ""
		}]).catch((e) => console.log(e))
		return
	}

	const data = await client.query({
		query: `SELECT *, toTimeZone(timestamp, 'Asia/Kolkata') as timestamp FROM analytics `,

		format: "JSON",
	})
	const datas = await data.json()
	// await client.query({
	// 	query: "TRUNCATE analytics"
	// })

	console.log(datas)
	console.log(formatLogTime(new Date((datas as any).data[0].timestamp)))
	console.log(typeof (datas as any).data[0].timestamp)
}
export const formatLogTime = (time: string | Date) => {
	const date = new Date(time)
	let hours = date.getHours()
	const minutes = date.getMinutes().toString().padStart(2, "0")
	const seconds = date.getSeconds().toString().padStart(2, "0")

	const ampm = hours >= 12 ? "PM" : "AM"
	hours = hours % 12 || 12

	return `${date.getDate()}/${date.getMonth() + 1}} - ${hours}:${minutes}:${seconds} ${ampm} -- ${date.getFullYear()}`
}
getClickhouseData().then(() => process.exit(0))
