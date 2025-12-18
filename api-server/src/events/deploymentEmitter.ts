import { EventEmitter } from "events";

class DeploymentEmitter extends EventEmitter {
	emitLog(eventString: string, log: any) {
		// console.log(`log:${eventString} --- from logs`)
		const emitData = { type: "LOG", data: log };
		this.emit(`log:${eventString}`, emitData);
	}
	onLog(eventString: string, callback: (log: any) => void) {
		// console.log(`log:${eventString}`)
		this.on(`log:${eventString}`, callback);
	}

	offLog(eventString: string, callback: (log: any) => void) {
		this.off(`log:${eventString}`, callback);
	}

	emitUpdates(eventString: string, update: any) {
		const emitData = { type: "UPDATE", data: update };
		this.emit(`update:${eventString}`, emitData);
	}
	onUpdate(eventString: string, callback: (log: any) => void) {
		this.on(`update:${eventString}`, callback);
	}

	offUpdate(eventString: string, callback: (log: any) => void) {
		this.off(`update:${eventString}`, callback);
	}

	offAll(eventString: string) {
		this.removeAllListeners(`update:${eventString}`);
		this.removeAllListeners(`log:${eventString}`);
	}
}
export const deploymentEmitter = new DeploymentEmitter();

import { Response, Request } from "express";

interface SSEClient {
	id: string;
	deploymentId: string;
	res: Response;
	listener: (data: any) => void;
	heartbeat: NodeJS.Timeout;
	errors: number;
}

class SSEManager {
	private emitter: DeploymentEmitter;
	private clients: Map<string, SSEClient>;

	constructor() {
		this.emitter = deploymentEmitter;
		this.emitter.setMaxListeners(10);
		this.clients = new Map();
	}

	addClient(clientId: string, deploymentId: string, res: Response, req: Request) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Accel-Buffering", "no");

		res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

		req.on("close", () => {
			if (!res.writableEnded) {
				res.write('event: close\ndata: {"status":"complete"}\n\n');
				res.end();
			}
			this.removeClient(clientId);
		});

		const listener = (event: any) => {
			try {
				res.write(`data: ${JSON.stringify(event)}\n\n`);
			} catch (error) {
				const old = this.clients.get(clientId) as SSEClient;
				console.log("Error on data sending SSEClient");
				if (old.errors > 3) {
					this.removeClient(clientId);
					this.emitter.offAll(deploymentId);
					return;
				}
				this.clients.set(clientId, { ...old, errors: (old.errors += 1) });
			}
		};

		this.emitter.onLog(deploymentId, listener);
		this.emitter.onUpdate(deploymentId, listener);

		const heartbeat = setInterval(() => {
			try {
				res.write(`:heartbeat\n\n`);
			} catch (error) {
				console.log("Error on heartbeat SSEClient");
				this.removeClient(clientId);
			}
		}, 30 * 1000);

		this.clients.set(clientId, {
			id: clientId,
			deploymentId,
			res,
			listener,
			heartbeat,
			errors: 0,
		});

		console.log(`Client connected: ${clientId}, Active clients: ${this.clients.size}`);
	}

	removeClient(clientId: string) {
		const client = this.clients.get(clientId);
		if (!client) return;

		this.emitter.offLog(client.deploymentId, client.listener);
		this.emitter.offUpdate(client.deploymentId, client.listener);

		clearInterval(client.heartbeat);

		try {
			client.res.write('event: close\ndata: {"status":"complete"}\n\n');
			client.res.end();
		} catch (error) {
			console.log("Error on client remove SSEClient");
			this.emitter.offAll(client.deploymentId);
		}

		this.clients.delete(clientId);

		console.log(`Client removed: ${clientId}, Active clients: ${this.clients.size}, ${this.clients}`);
	}
	removeClientsByDeployment(deploymentId: string) {
		const clientsToRemove = Array.from(this.clients.entries())
			.filter(([_, client]) => client.deploymentId === deploymentId)
			.map(([clientId]) => clientId);
		clientsToRemove.forEach((clientId) => this.removeClient(clientId));
		console.log(`Client removed: with deployment ->${deploymentId}, Active clients: ${this.clients.size}, ${this.clients}`);

		this.emitter.offAll(deploymentId);
	}
	getClientCount(): number {
		return this.clients.size;
	}

	getListeners(): (string | symbol)[] {
		const names = this.emitter.eventNames();
		return names;
	}
	getEventFns(): any {
		const names = this.emitter.eventNames();
		const arr = names.map((name) => ({
			eventString: name,
			fns: this.emitter.listeners(name).map((fn) => fn.toString()),
		}));
		return arr;
	}

	cleanup() {
		for (const [clientId] of this.clients) {
			this.removeClient(clientId);
		}
	}
}

export const sseManager = new SSEManager();
