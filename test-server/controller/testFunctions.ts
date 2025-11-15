import { Request, Response } from "express";
import path from "path";
import { generateSlug } from "random-word-slugs";
import { producer } from "../config/kafka";
import { existsSync, lstatSync, readdirSync } from "fs";
const statusAr = ["NOT_STARTED", "BUILDING", "QUEUED", "READY", "FAILED", "CANCELLED"]
const techArr = ["react", "vite", "angular", "solid", "vuejs", "svelte"]
const infoAr = ['INFO', 'SUCCESS', 'WARN', 'ERROR']




export async function testSubmit1(req: Request, res: Response) {
	const { topic, message } = req.body;


	if (!topic || !message) {
		return res.status(400).json({ error: 'Both topic and message are required.' });
	}


	const randomValue = infoAr[Math.floor(Math.random() * infoAr.length)];
	console.log(`Received topic: ${topic}`);
	console.log(`Received message: ${message}`);
	const DEPLOYMENT_ID = "68ff74fc0c735bac01ff7347"
	const PROJECT_ID = "68fb1ccb10b93de245fa9f55"
	for (let i = 0; i < 1; i++) {
		const value = JSON.stringify({
			eventId: '38a86d69-a1b8-4f12-a488-5ff2bf61a489',
			eventType: 'DEPLOYMENT_LOG',
			data: {
				deploymentId: DEPLOYMENT_ID,
				projectId: PROJECT_ID,
				log: {
					level: randomValue,
					message: "message no. " + i + " " + generateSlug(),
					timestamp: new Date().toISOString(),
					stream: "data error"
				}
			}
		})
		console.log(value)

		await producer.send({
			topic: "deployment.logs", messages: [
				{ key: "log", value: value }
			]
		});
		console.log(i, "<<<<")
	}
	res.json({ success: true, topic, message });
}

export async function testSubmit2(req: Request, res: Response) {
	const { topic, message } = req.body;


	if (!topic || !message) {
		return res.status(400).json({ error: 'Both topic and message are required.' });
	}


	const randomValue = statusAr[Math.floor(Math.random() * statusAr.length)];
	const randomValue2 = techArr[Math.floor(Math.random() * statusAr.length)];

	console.log(`Received topic: ${topic}`);
	console.log(`Received message: ${message}`);
	const DEPLOYMENT_ID = "68ff74fc0c735bac01ff7347"
	const PROJECT_ID = "68fb1ccb10b93de245fa9f55"
	const distFolderPath = path.join("../reverse-proxy-server/src/");
	if (!existsSync(distFolderPath)) {
		throw new Error(' folder not found after build');
	}
	const distFolderContents = readdirSync(distFolderPath, { recursive: true })
	let fileStructre: any = []
	let totalSize = 0
	for (const file of distFolderContents) {
		const filePath = path.join(distFolderPath, file as string)
		const fileStat = lstatSync(filePath)
		if (fileStat.isDirectory()) continue

		fileStructre.push({ name: file, size: fileStat.size })
		totalSize += fileStat.size

	}

	const value = JSON.stringify({
		eventId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		eventType: "DEPLOYMENT_UPDATES",
		data: {
			deploymentId: DEPLOYMENT_ID,
			projectId: PROJECT_ID,
			updateType: "CUSTOM",
			updates: {
				status: randomValue,
				techStack: randomValue2,
				commit_hash: generateSlug(6),
				install_ms: Math.floor(Math.random() * 100),
				error_message: generateSlug(8),
				complete_at: new Date().toISOString(),
				file_structure: { files: fileStructre, totalSize }
			}
		}
	})
	await producer.send({
		topic: "deployment.updates",
		messages: [{
			key: DEPLOYMENT_ID,
			value
		}]
	});
	res.json({ success: true, topic, message, value });
}




export async function testSubmit3(req: Request, res: Response) {
	const { topic, message } = req.body;
	if (!topic || !message) {
		return res.status(400).json({ error: 'Both topic and message are required.' });
	}
	console.log(`Received topic: ${topic}`);
	console.log(`Received message: ${message}`);
	const PROJECT_ID = "68fb1ccb10b93de245fa9f55"

	const value = JSON.stringify({
		projectId: PROJECT_ID,
		subdomain: "wooden-little-terabyte-5628",
		timestamp: new Date().getTime(),
		path: req.url,
		requestSize: Math.floor(Math.random() * 10000),
		responseSize: Math.floor(Math.random() * 10000),
		responseTime: Math.floor(Math.random() * 100),
		ip: req.socket.remoteAddress || "",
		statusCode: res.statusCode || Math.floor(Math.random() * 100),
		uaBrowser: "chrome",
		uaOs: "windows",
		isMobile: Math.floor(Math.random()) % 2 === 0,
		isBot: Math.floor(Math.random()) % 2 === 0,
		referer: req.headers['referer'] || ""
	})
	const total = Math.floor(Math.random() * 100)
	await producer.send({
		topic: "project.analytics",
		messages: Array.from({ length: total }, () => ({
			key: PROJECT_ID,
			value
		}))
	});
	res.json({ success: true, topic, message, value, total });
}