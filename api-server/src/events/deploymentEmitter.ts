import { EventEmitter } from 'events';

class DeploymentEmitter extends EventEmitter {

	emitLog(eventString: string, log: any) {
		// console.log(`log:${eventString} --- from logs`)
		const emitData = { type: "LOG", data: log }
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
		const emitData = { type: "UPDATE", data: update }
		this.emit(`update:${eventString}`, emitData);
	}
	onUpdate(eventString: string, callback: (log: any) => void) {
		this.on(`update:${eventString}`, callback);
	}

	offUpdate(eventString: string, callback: (log: any) => void) {
		this.off(`update:${eventString}`, callback);
	}


	offAll(eventString: string) {
		this.removeAllListeners(`update:${eventString}`)
		this.removeAllListeners(`log:${eventString}`)
	}
}
export const deploymentEmitter = new DeploymentEmitter();