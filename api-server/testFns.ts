import "dotenv/config";
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
import path from "path";
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

console.log("--------------------------------------------------------------------------------------------------------------");
async function mongodbData() {
    try {
        await connectDb();
        const p = new P_repo();
        const de = new D_repo();
        // console.log(await Project.updateMany({}, { $set: { currentDeployment: null, tempDeployment: null, deployments: [] } }),)

        const project = await Project.findById("691e1c418cb08e07e28986dc").populate("deployments", "commit_hash");

        const userId = "68e4a04f1e57fa3fe5b1a81e";
        const user = await User.findById(userId);

        // await p.createProject({ name: "TEST_PROJECT_1", repoURL: "TEST_PROJECT_1_REPO", status: "READY", user: user._id, subdomain: "testable-subdomain", })
        return;
        for (let i = 0; i < 0; i++) {
            const obj = {
                project: project?._id,
                status: "READY",
                s3Path: project?._id.toString(),
                user: user?._id,
                commit_hash: "692a6b3a6fc8242ec791c8e99362d070408738d4||build: TEST_PROJECT" + (i + 1),
                install_ms: 6784.54,
                build_ms: 4669.79,
                overWrite: false,
                duration_ms: 13531.03,
                createdAt: new Date(),
                updatedAt: new Date(),
                complete_at: new Date(),
            };
            const d1 = await Deployment.insertOne({
                ...obj,
                file_structure: {
                    totalSize: 7283412,
                    files: [
                        { name: "/assets/media/icons/settings.svg", size: 3120 },
                        { name: "/assets/media/icons/dashboard.svg", size: 2890 },

                        { name: "/assets/media/photos/team/photo_01.jpg", size: 442112 },
                        { name: "/assets/media/photos/team/photo_02.jpg", size: 398220 },
                        { name: "/assets/media/photos/conference_2025.png", size: 812334 },

                        { name: "/assets/audio/notification.wav", size: 182112 },
                        { name: "/assets/audio/success_tone.mp3", size: 92344 },

                        { name: "/assets/data/config/app.json", size: 2312 },
                        { name: "/assets/data/config/routes.json", size: 7840 },
                        { name: "/assets/data/data_dump_01.bin", size: 531122 },

                        { name: "/assets/js/modules/auth.js", size: 45222 },
                        { name: "/assets/js/modules/analytics.js", size: 38214 },
                        { name: "/assets/js/modules/admin/users.js", size: 56214 },
                        { name: "/assets/js/modules/admin/settings.js", size: 33110 },

                        { name: "/assets/css/theme-dark.css", size: 51220 },
                        { name: "/assets/css/theme-light.css", size: 50300 },
                        { name: "/assets/css/global.css", size: 29340 },

                        { name: "/assets/docs/privacy-policy.pdf", size: 238814 },
                        { name: "/assets/docs/release-notes-v2.1.pdf", size: 129448 },

                        { name: "/assets/videos/promo/promo_1080p.mp4", size: 2189440 },
                        { name: "/assets/videos/promo/teaser_720p.webm", size: 1322880 },
                    ],
                },
            });
            await Project.updateOne({ _id: d1.project }, { currentDeployment: d1._id.toString(), $addToSet: { deployments: d1._id } });
            await new Promise((res) => setTimeout(res, 5000));
            console.log("done 1");
        }
        console.log("found>> ", project);

        const deplos = await Deployment.find({ project: project?._id }, { createdAt: 1, commit_hash: 1 }).sort("createdAt");

        console.log(deplos.map((dep) => ({ commit_hash: dep.commit_hash, time: formatTimeWithSeconds(new Date(dep.createdAt)) })));

        await mongoose.disconnect();
    } catch (error) {
        console.log(error);
    } finally {
        process.exit(0);
    }
}
mongodbData();

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
    const groupId = "vercel-logs-group";
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
    const insert = 2 === 2 + 3;

    if (insert) {
        console.log("inserting....");
        const analyticsRepo = new AnalyticsRepo(client);
        await analyticsRepo
            .insertBatch([
                {
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
                    referer: "",
                },
            ])
            .catch((e) => console.log(e));
        return;
    }

    const data = await client.query({
        query: `truncate log_events `,
        // format: "JSON",
    });
    const datas = await data.json();
    console.log(datas.data.length);
    // await client.query({
    // 	query: "TRUNCATE analytics"
    // })
}
// getClickhouseData().then(() => process.exit(0))
