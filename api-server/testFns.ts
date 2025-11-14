import "dotenv/config"
import { Kafka } from "kafkajs";
import { Deployment } from "./src/models/Deployment";
import { Project } from "./src/models/Projects";
import P_repo from "./src/repositories/project.repository";
import D_repo from "./src/repositories/deployment.repository";
import AnalyticsRepo from "./src/repositories/analytics.repository";
import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";
import { User } from "./src/models/User";
import { client } from "./src/config/clickhouse";
import { exec } from "child_process";
import path from "path"
import { existsSync, lstatSync, readdirSync } from "fs";





function formatTimeWithSeconds(input: Date | string | number): string {
	const date = input instanceof Date ? input : new Date(input);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date input");
	}

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12 || 12; // Convert 0–23 → 1–12 range

	// Pad with leading zeros
	const hh = String(hours).padStart(2, "0");
	const mm = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");

	return `${hh}:${mm}:${ss} ${ampm}`;
}


console.log('--------------------------------------------------------------------------------------------------------------')
async function mongodbData() {
	try {
		await connectDb();
		const p = new P_repo()
		const de = new D_repo()
		// console.log(await Project.updateMany({}, { deployments: [] }), await Deployment.deleteMany({}));
		const project = await Project.findById("6915d856e9c778440b64bf8d").populate("deployments", "commit_hash")
		const userId = "68e4a04f1e57fa3fe5b1a81e"
		const user = await User.findById(userId)
		// await p.createProject({ name: "TEST_PROJECT_1", repoURL: "TEST_PROJECT_1_REPO", user: user._id, subdomain: "testable-subdomain", })


		const obj = {
			project: project?._id,
			status: 'READY',
			s3Path: project?._id.toString(),
			userId: user?._id,
			commit_hash: 'project__6',
			install_ms: 6784.54,
			build_ms: 4669.79,
			overWrite: false,
			duration_ms: 13531.03,
			createdAt: new Date(),
			updatedAt: new Date(),
			complete_at: new Date()
		}
		console.log("found>> ", project)
		// await p.pullDeployments(project._id, user._id, project?.deployments[0]._id, null)


		const deplos = await Deployment.find({ project: project?._id }, { createdAt: 1, commit_hash: 1 }).sort("createdAt")
		// await p.pushToDeployments(project._id, user._id, deplos[deplos.length - 1]._id)
		console.log(deplos.map((dep) => ({ commit_hash: dep.commit_hash, time: formatTimeWithSeconds(new Date(dep.createdAt)) })))


		await mongoose.disconnect()
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
	console.log(typeof (datas as any).data[0].timestamp)
}
// getClickhouseData().then(() => process.exit(0))

const buildFileTree = (files: { name: string; size: number }[]) => {
	const root: any = { name: 'root', children: {}, files: [] };
	files.forEach(file => {
		const parts = file.name.split('/');
		let current = root;
		parts.forEach((part, index) => {
			if (index === parts.length - 1) {
				// It's a file
				current.files.push({ name: part, size: file.size, fullPath: file.name });
			} else {
				// It's a directory
				if (!current.children[part]) {
					current.children[part] = { name: part, children: {}, files: [] };
				}
				current = current.children[part];
			}
		});
	});
	console.log(JSON.stringify(root, null, 2))
}
buildFileTree([
	{ name: "index.html", size: 4523 },
	{ name: "assets/main-abc123.js", size: 245678 },
	{ name: "assets/vendor-def456.js", size: 1234567 },
	{ name: "assets/styles-ghi789.css", size: 45678 },
	{ name: "_next/static/chunks/main.js", size: 123456 },
	{ name: "_next/static/chunks/webpack.js", size: 67890 },
	{ name: "images/logo.png", size: 12345 },
	{ name: "images/hero.jpg", size: 234567 },
	{ name: "favicon.ico", size: 1234 }
])