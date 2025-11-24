import { spawn } from "child_process"

import { existsSync, } from "fs"
import { readdir, stat, rename, mkdir, rm, readFile } from 'fs/promises';
import path from "path"
import mime from "mime-types"
import { Kafka } from "kafkajs"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fileURLToPath } from "url";
import { randomUUID } from "crypto"
import simpleGit from "simple-git";

let DEPLOYMENT_ID = process.env.DEPLOYMENT_ID || "692461eecfa1bb98cf35b16f"   // Received from env by apiserver or use backup for local testing
let PROJECT_ID = process.env.PROJECT_ID || "692461b6cfa1bb98cf35b166"   // Received from env by apiserver or use backup for local testing

const kafka = new Kafka({
	clientId: `docker-build-server-${PROJECT_ID}`,
	brokers: ["pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092"],
	ssl: true, // or key
	sasl: {
		username: process.env.KAFKA_USERNAME,
		password: process.env.KAFKA_PASSWORD,
		mechanism: "plain"
	},
})

const API_SERVER_CONTAINER_API_TOKEN = process.env.CONTAINER_API_TOKEN
const producer = kafka.producer()


const s3Client = new S3Client({
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESSKEY,
		secretAccessKey: process.env.AWS_SECRETKEY,
	}
})
const AWS_BUCKET_NAME = process.env.AWS_S3_BUCKET

console.log("Starting file..")
const git = simpleGit();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ContainerError extends Error {
	constructor(message, stream, cause = "", cancelled = false) {
		super(message, cause);
		this.name = "CUSTOM_ERROR";
		this.stream = stream
		this.cause = cause
		this.cancelled = cancelled
	}
}
const deploymentStatus = {
	NOT_STARTED: "NOT_STARTED",
	QUEUED: "QUEUED",
	BUILDING: "BUILDING",
	READY: "READY",
	FAILED: "FAILED",
	CANCELED: "CANCELLED"
}

const settings = {
	customBuildPath: true,
	sendKafkaMessage: true,
	deleteSourcesAfter: true,
	localDeploy: true,
	runCommands: true,            // for testing only 
	cloneRepo: true            // for testing only 
}

console.log(DEPLOYMENT_ID, PROJECT_ID, "<<<<<")

let gitCommitData = process.env.GIT_COMMIT_DATA || "692a6b3a6fc8242ec791c8e99362d070408738d4||build: settings change feature"



let logsNumber = 0
let logBuffer = [];
let flushTimer = null;
// ----------------------------------------------------FUNCTIONS--------------------------------------------------

const sendLogsAsBatch = async () => {
	if (flushTimer) {
		clearTimeout(flushTimer);
		flushTimer = null;
	}
	if (logBuffer.length === 0) return;
	try {
		await producer.send({
			topic: "deployment.logs",
			messages: logBuffer.map(log => ({
				key: "log",
				value: JSON.stringify(log)
			}))
		});
		console.log(`Sent ${logBuffer.length} logs`);
		logBuffer = [];
	} catch (error) {
		console.error("Kafka batch send failed:", error);
		logBuffer = [];
	}
}
const publishLogs = (logData = {}) => {
	logsNumber++
	if (!settings.sendKafkaMessage) return
	logBuffer.push({
		eventId: randomUUID(),
		eventType: 'DEPLOYMENT_LOG',
		data: {
			deploymentId: logData.DEPLOYMENT_ID,
			projectId: logData.PROJECT_ID,
			log: {
				level: logData.level,
				message: logData.message,
				timestamp: new Date().toISOString(),
				stream: logData.stream
			}
		}
	});
	if (!flushTimer) {
		flushTimer = setTimeout(sendLogsAsBatch, 300);
	}
	if (logBuffer.length >= 50) {
		if (flushTimer) {
			clearTimeout(flushTimer);
			flushTimer = null;
		}
		sendLogsAsBatch();

	}
}

const publishUpdates = async (updateData = {}) => {
	if (!settings.sendKafkaMessage) return
	try {
		const value = JSON.stringify({
			eventId: randomUUID(),
			eventType: 'DEPLOYMENT_UPDATES',
			data: {
				deploymentId: updateData.DEPLOYMENT_ID,
				projectId: updateData.PROJECT_ID,
				updateType: updateData.type,
				updates: {
					...(updateData.status && { status: updateData.status }),
					...(updateData.complete_at && { complete_at: updateData.complete_at }),
					...(updateData.duration_ms && { duration_ms: updateData.duration_ms }),
					...(updateData.techStack && { techStack: updateData.techStack }),
					...(updateData.install_ms && { install_ms: updateData.install_ms }),
					...(updateData.build_ms && { build_ms: updateData.build_ms }),
					...(updateData.commit_hash && { commit_hash: updateData.commit_hash }),
					...(updateData.error_message && { error_message: updateData.error_message }),
					...(updateData.file_structure && { file_structure: updateData.file_structure }),
				}
			}
		})
		await producer.send({
			topic: "deployment.updates", messages: [
				{ key: "log", value: value }
			]
		})
	} catch (error) {
		console.log("error on sending update", updateData.type, error)
	}
}

async function cloneGitRepoAndValidate(taskDir, runDir, projectData) {

	if (settings.localDeploy && settings.cloneRepo) {
		await git.clone(projectData.repoURL, taskDir, [
			'--filter=blob:none',
			'--branch', projectData.branch,
			'--single-branch'
		], (data) => {
			console.log("done cloning = >", data)
		})
	} else {
		console.log("skiping git clone")
	}
	if (!existsSync(runDir)) {
		throw new ContainerError("Git repo not found or cloned..", "file validation")
	}
	else {
		return true
	}
}
async function getGitCommitData(taskDir) {
	const repoGit = simpleGit(taskDir);
	const logss = await repoGit.log({})
	return logss.all[0].hash + "||" + logss.all[0].message
}

async function loadProjectData(deploymentId = "") {
	const API_ENDPOINT = process.env.API_ENDPOINT
	const baseUrl = `${API_ENDPOINT}/api/internal`

	const deploymentResponse = await fetch(`${baseUrl}/deployments/${deploymentId}`, {
		headers: {
			Authorization: `Bearer ${API_SERVER_CONTAINER_API_TOKEN}`
		}
	})

	const deploymentData = await deploymentResponse.json()
	if (!deploymentData.deployment) {

		throw new ContainerError("Deployment data not found", "data fetching", "Invalid project or deployment Id")
	}

	const projectId = deploymentData.deployment.project
	const projectResponse = await fetch(`${baseUrl}/projects/${projectId}`, {
		headers: {
			Authorization: `Bearer ${API_SERVER_CONTAINER_API_TOKEN}`
		}
	})

	const projectData = await projectResponse.json()
	if (!projectData.project) {

		throw new ContainerError("Project data not found", "data fetching", "Invalid project or deployment Id")
	}
	if (!projectData.project.installCommand) {
		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "WARN",
			message: "install command not found; running with default command", stream: "data error"
		})
		//logs

	}
	if (!projectData.project.buildCommand) {
		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "WARN",
			message: "build command not found; running with default command", stream: "data error"
		})
		//logs
	}

	return [projectData.project, deploymentData.deployment]
}

function getDynamicBuildRoot(tool = "") {
	tool = tool.toLowerCase();

	switch (true) {
		case tool.includes("vite"):
			return "--base=./";

		case tool.includes("cra") || tool.includes("react-scripts"):
			return "PUBLIC_URL=.";

		case tool.includes("angular"):
			return "--base-href ./ --configuration production";

		case tool.includes("parcel"):
			return "--public-url ./";

		case tool.includes("webpack"):
			return "output.publicPath = './'";

		case tool.includes("snowpack"):
			return "--base-url ./";

		case tool.includes("astro"):
			return "--base ./";

		default:
			return "";
	}
}

function detectFrontendBuildConfig(pkg = {}) {
	const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
	const names = Object.keys(deps).map(n => n.toLowerCase());

	const hasExact = name => names.includes(name.toLowerCase());
	const hasLike = substr => names.some(n => n.includes(substr.toLowerCase()));

	let tool = 'Unknown';
	if (hasExact('vite')) tool = 'Vite';
	else if (hasExact('react-scripts')) tool = 'CRA';
	else if (hasExact('@angular/cli')) tool = 'Angular CLI';
	else if (hasLike('parcel')) tool = 'Parcel';
	else if (hasLike('webpack')) tool = 'Webpack';
	else if (hasLike('snowpack')) tool = 'Snowpack';
	else if (hasLike('rollup')) tool = 'Rollup';

	let framework = 'Unknown';
	if (hasExact('@angular/core') || hasLike('@angular/')) framework = 'Angular';
	else if (hasExact('react') || hasLike('react-dom')) framework = 'React';
	else if (hasExact('vue') || hasLike('@vue/') || hasLike('vue-router')) framework = 'Vue';
	else if (hasExact('svelte') || hasLike('svelte/')) framework = 'Svelte';
	else if (hasExact('solid-js') || hasLike('solid-start')) framework = 'Solid';
	else if (hasExact('preact') || hasLike('preact/')) framework = 'Preact';
	else if (hasExact('lit') || hasLike('lit-element') || hasLike('lit-html')) framework = 'Lit';
	else if (hasExact('alpinejs') || hasLike('alpinejs')) framework = 'Alpine';
	else if (hasExact('ember-source') || hasLike('ember-')) framework = 'Ember';

	return { framework, tool };
}



async function validatePackageJsonAndGetFramework(dir, rootDir) {
	const packageJsonPath = path.join(dir, "package.json")
	if (!existsSync(packageJsonPath)) {

		throw new ContainerError(`package.json not found in ${rootDir}`, "file validation", "", true);
	}

	const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))

	const suspiciousPatterns = [
		/rm\s+-rf/,
		/curl.*bash/,
		/wget.*bash/,
		/eval/,
		/exec/,
		/child_process/
	]
	const suspiciousCommands = [
		'curl', 'wget', 'Invoke-WebRequest', 'certutil',
		'rm -rf', 'rmdir', 'del ', 'format ', 'mkfs', 'chmod', 'chown',
		'scp', 'ftp', 'base64', 'eval(', 'spawn(', 'exec(', 'shutdown',
		'sudo', 'dd if=', 'mkfs', 'tar -cf /', 'nc ', 'netcat'
	];


	const scripts = packageJson.scripts || {}
	for (const [name, script] of Object.entries(scripts)) {
		const trimmed = script.trim()
		for (const pattern of suspiciousPatterns) {
			if (pattern.test(trimmed)) {

				throw new ContainerError(`Suspicious script detected: ${name}`, "file validation", "Invalid Package.json file", true);
			}
		}
		for (const command of suspiciousCommands) {
			if (trimmed.toLowerCase().includes(command.toLowerCase())) {

				throw new ContainerError(`Suspicious script detected: ${name}`, "file validation", "Invalid Package.json file", true);
			}
		}

		const match = trimmed.match(/(\.\/[^\s]+\.sh|\w+\.sh|\w+\.bat|\w+\.ps1)/);
		if (match) {

			throw new ContainerError(`Suspicious script detected: ${name}: ${trimmed}`, "file validation", "Invalid Package.json file", true);
		}
	}
	console.log("All cleared..")

	return detectFrontendBuildConfig(packageJson)
}

function killProcess(proc) {
	if (!proc || proc.killed) return;

	try {
		process.kill(-proc.pid, 'SIGTERM');
		setTimeout(() => {
			if (!proc.killed) {
				process.kill(-proc.pid, 'SIGKILL');
			}
		}, 5000);
	} catch (err) {
		console.error("Error killing process:", err);
	}
}


/**
 * Runs a system command as a child process.
 *
 * @param {string} command - The executable or command to run (e.g., "node", "git").
 * @param {string[]} args - List of command arguments.
 * @param {string} cwd - The working directory to run the command in.
 * @param {{name: string, value: string}[]} [env=[]] - Additional environment variables to include as array of object with name and value as strings.
 * @returns {Promise<void>} Resolves when the command finishes, rejects on error.
 */
let currentProcess = null
async function runCommand(command, args, cwd, env = []) {
	if (!settings.runCommands) {
		console.log("Skipping run command")
		return
	}
	const envVars = Object.fromEntries(env.map((e) => [e.name, e.value]))
	console.log(env, args)
	return new Promise(async (resolve, reject) => {
		const runnerProcess = spawn(command, args, {
			cwd,
			timeout: 60 * 1000 * 15,
			env: {
				...process.env,
				...envVars
			},
			shell: process.platform === "win32",
		})
		currentProcess = runnerProcess;

		const timeoutId = setTimeout(() => {
			console.log(`Killing process due to timeout: ${command}`);
			killProcess(runnerProcess);
			reject(new ContainerError(`${command} timed out after 15 minutes`, "stderr"));
		}, 15 * 60 * 1000);

		runnerProcess.stdout.on("data", (data) => {
			console.log(data.toString(), "--")
			publishLogs({
				DEPLOYMENT_ID, PROJECT_ID,
				level: "INFO",
				message: data.toString(), stream: "stdout"
			})
		})
		runnerProcess.stderr.on("data", (data) => {
			console.log(data.toString())
			publishLogs({
				DEPLOYMENT_ID, PROJECT_ID,
				level: "ERROR",
				message: data.toString(), stream: "stderr"
			})

		})
		runnerProcess.on("error", (err) => {
			console.log(err)
			publishLogs({
				DEPLOYMENT_ID, PROJECT_ID,
				level: "ERROR",
				message: err.message, stream: "stderr"
			})
			reject(new ContainerError("Failed to start " + command + " " + err.message, "stderr"))
			//logs
		})
		runnerProcess.on("close", (code, signal) => {
			clearTimeout(timeoutId);
			currentProcess = null;
			console.log(`[CLOSE] Code: ${code}, Signal: ${signal}`);
			if (code === 0) {
				resolve()
			}
			else {
				publishLogs({
					DEPLOYMENT_ID, PROJECT_ID,
					level: "ERROR",
					message: `${command} exited with code ${code}`, stream: "stderr"
				})
				reject(new ContainerError(`${command} exited with code ${code}`, "stderr"))
			}
		})
		runnerProcess.on('exit', (code, signal) => {
			if (signal === 'SIGTERM') {
				publishLogs({
					DEPLOYMENT_ID, PROJECT_ID,
					level: "ERROR",
					message: `${command} timed out`, stream: "stderr"
				})
				reject(new ContainerError(`${command} timed out`, "stderr"));
			}
		});


	})
}


async function uploadOrMoveFiles(sourceDir, targetDir) {
	console.log("trying to move", sourceDir, targetDir)
	const fileStructure = []
	let totalSize = 0;
	async function processDirectory(currentDir, relativePath = "") {
		const entries = await readdir(currentDir, { withFileTypes: true })
		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)
			const relPath = path.join(relativePath, entry.name)

			if (entry.isDirectory()) {
				if (settings.localDeploy) {
					await mkdir(path.join(targetDir, relPath), { recursive: true });
					console.log("moving")
				}
				await processDirectory(fullPath, relPath);

			} else if (entry.isFile()) {
				const fileStat = await stat(fullPath);
				const normalizedPath = path.normalize(fullPath);
				if (!normalizedPath.startsWith(sourceDir)) {
					console.warn(`Skipping suspicious file path: ${relPath}`);
					publishLogs({
						DEPLOYMENT_ID, PROJECT_ID,
						level: "WARN",
						message: `Skipping suspicious file path: ${relPath}`,
						stream: "system"
					});
					continue;
				}
				fileStructure.push({ name: relPath, size: fileStat.size });
				totalSize += fileStat.size;
				publishLogs({
					DEPLOYMENT_ID, PROJECT_ID,
					level: "INFO",
					message: "uploading " + relPath,
					stream: "system"
				});
				if (settings.localDeploy) {
					const targetPath = path.join(targetDir, relPath);
					await rename(fullPath, targetPath);
					console.log("Moved " + relPath)
				} else {
					console.log("Uploading " + relPath);

					// const command = new PutObjectCommand({
					// 	Bucket: AWS_BUCKET_NAME,
					// 	Key: `__app_build_outputs/${PROJECT_ID}/${DEPLOYMENT_ID}/${relPath}`,
					// 	Body: createReadStream(fullPath),
					// 	ContentType: mime.lookup(fullPath)
					// });
					// await s3Client.send(command);
				}
			}
		}
	}
	await processDirectory(sourceDir);
	return { fileStructure, totalSize };
}

// --------------------------------------------------------MAIN_TASK--------------------------------------------------

async function init() {
	if (settings.sendKafkaMessage) {
		await producer.connect();
	}
	publishLogs({
		DEPLOYMENT_ID, PROJECT_ID,
		level: "INFO",
		message: `Starting deployment..`, stream: "system"
	})
	const timerStart = performance.now()
	await publishUpdates({
		DEPLOYMENT_ID, PROJECT_ID,
		type: "START",
		commit_hash: gitCommitData,
		status: deploymentStatus.BUILDING
	})

	try {
		//logs
		console.log("Executing script.js")
		console.log("fetching project data")
		const taskDir = path.join(__dirname, "../test-grounds/")             // UPDATE THIS ON DEPLOYMENT !!!!!!!!!!!!!!!!!
		const [projectData, deploymentData] = await loadProjectData(DEPLOYMENT_ID)
		DEPLOYMENT_ID = deploymentData._id
		PROJECT_ID = projectData._id

		const installCommand = projectData.installCommand || "install"
		const buildCommand = projectData.buildCommand || "build"
		const outputFilesDir = projectData.outputDirectory || "dist"


		console.log({ projectData, deploymentData, installCommand, buildCommand, outputFiles: outputFilesDir })

		const runDir = path.join(taskDir, projectData.rootDir)
		console.log(runDir)
		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "INFO",
			message: `cloning repo..`, stream: "system"
		})

		gitCommitData = await getGitCommitData(taskDir) || gitCommitData
		await cloneGitRepoAndValidate(taskDir, runDir, projectData)

		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "INFO",
			message: `git repo cloned...`, stream: "system"
		})

		const framweworkIdentified = await validatePackageJsonAndGetFramework(runDir, projectData.rootDir)
		const buildOptions = getDynamicBuildRoot(framweworkIdentified.tool)
		console.log(framweworkIdentified, buildOptions)


		const installTimer = performance.now()
		let installTries = 0
		while (installTries < 3) {
			try {
				await runCommand("npm", [...installCommand.split(" "), ...(installTries > 0 ? installTries > 1 ? ["--force"] : ["--legacy-peer-deps"] : [])],
					runDir, projectData.env || [])
				break
			} catch (error) {
				installTries++
				publishLogs({
					DEPLOYMENT_ID, PROJECT_ID,
					level: "WARN",
					message: `Failed to install with command ${installCommand}\n retrying install ${installTries}`, stream: "system"
				})
				if (installTries >= 3) throw error;
				await new Promise(r => setTimeout(r, 2000));
			}
		}
		const installEndTimer = performance.now()

		console.log('Dependencies installed successfully in ', (installEndTimer - installTimer).toFixed(2), " ms");

		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "SUCCESS",
			message: `Dependencies installed successfully  in ${(installEndTimer - installTimer).toFixed(2)} ms`, stream: "system"
		})

		const buildTimer = performance.now()

		await runCommand(
			"npm",
			["run", ...buildCommand.split(" "), ...((settings.customBuildPath && framweworkIdentified.tool.toLowerCase() !== "cra") ? ["--", buildOptions] : [])],
			runDir,
			(framweworkIdentified.tool.toLowerCase() === "cra" && settings.customBuildPath)
				? [...(projectData.env || []), { name: "PUBLIC_URL", value: "." }]
				: [...projectData.env]
		)

		const buildEndTimer = performance.now()
		console.log("Build complete ", (buildEndTimer - buildTimer).toFixed(2), " ms")


		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "SUCCESS",
			message: `Build complete    in ${(buildEndTimer - buildTimer).toFixed(2)} ms`, stream: "system"
		})


		const distFolderPath = path.join(runDir, outputFilesDir);
		if (!existsSync(distFolderPath)) {
			throw new ContainerError(outputFilesDir + ' folder not found after build', "system");
		}
		console.log("done.....");
		console.log("Post build configurations running....")

		const { fileStructure, totalSize } = await uploadOrMoveFiles(distFolderPath,
			path.join(`../test-server/public/user-projects/${PROJECT_ID}/${DEPLOYMENT_ID}/`)
		)
		if (settings.localDeploy && settings.deleteSourcesAfter) {
			await rm(taskDir, { recursive: true, force: true });
			await mkdir(taskDir, { recursive: true });
		}


		const timerEnd = performance.now();
		const durationMs = timerEnd - timerStart;

		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "SUCCESS",
			message: "Done ...🎉🎉", stream: "system"
		})

		publishLogs({
			DEPLOYMENT_ID, PROJECT_ID,
			level: "INFO",
			message: "Task done in " + durationMs.toFixed(2) + " ms🎉🎉🎉", stream: "system"
		})
		await publishUpdates({
			DEPLOYMENT_ID, PROJECT_ID,
			type: "END",
			status: deploymentStatus.READY,
			techStack: framweworkIdentified.framework,
			install_ms: Number((installEndTimer - installTimer).toFixed(2)),
			build_ms: Number((buildEndTimer - buildTimer).toFixed(2)),
			duration_ms: Number(durationMs.toFixed(2)),
			commit_hash: gitCommitData,
			complete_at: new Date().toISOString(),
			file_structure: { files: fileStructure, totalSize }
		})

		console.log("Time taken ", durationMs.toFixed(2), "logs number ", logsNumber)
	} catch (err) {
		//logs	
		if (err instanceof ContainerError) {
			publishLogs({
				DEPLOYMENT_ID, PROJECT_ID,
				level: "ERROR",
				message: `${err.message} || ${err.cause}`, stream: err.stream
			})
			await publishUpdates({
				DEPLOYMENT_ID, PROJECT_ID,
				type: "ERROR",
				status: err.cancelled ? deploymentStatus.CANCELED : deploymentStatus.FAILED,
				error_message: err.message + " || " + err.cause
			})
		}
		else {
			publishLogs({
				DEPLOYMENT_ID, PROJECT_ID,
				level: "ERROR",
				message: `Internal Server Error`, stream: "Server"
			})
			await publishUpdates({
				DEPLOYMENT_ID, PROJECT_ID,
				type: "ERROR",
				status: deploymentStatus.FAILED,
				error_message: "Internal server error"
			})
		}
		console.log(err)
	} finally {
		await sendLogsAsBatch()
		await producer.disconnect()
		// publisher.quit()
		process.exit(0)

	}
}

process.on('SIGTERM', async () => {
	console.log('Terminate signal, cleaning up...');
	if (currentProcess) killProcess(currentProcess);
	await producer.disconnect();
	process.exit(0);
});

process.on('SIGINT', async () => {
	console.log('Kill signal  cleaning up...');
	if (currentProcess) killProcess(currentProcess);
	await producer.disconnect();
	process.exit(0);
});

process.on('uncaughtException', async (err) => {
	console.error('Error:', err);
	if (currentProcess) killProcess(currentProcess);
	await publishUpdates({
		DEPLOYMENT_ID, PROJECT_ID,
		type: "ERROR",
		status: deploymentStatus.FAILED,
		error_message: "Internal server error"
	});
	await producer.disconnect();
	process.exit(1);
});

init()
