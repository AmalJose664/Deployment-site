import { EventEmitter } from 'events';

class DeploymentEmitter extends EventEmitter {

	emitLog(eventString: string, log: any) {
		// console.log(`log:${eventString} --- from logs`)
		this.emit(`log:${eventString}`, log);
	}
	onLog(eventString: string, callback: (log: any) => void) {
		// console.log(`log:${eventString}`)
		this.on(`log:${eventString}`, callback);
	}

	offLog(eventString: string, callback: (log: any) => void) {
		this.off(`log:${eventString}`, callback);
	}

	emitUpdates(eventString: string, log: any) {
		this.emit(`update:${eventString}`, log);
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