import { Log } from "@/types/Log";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: Log[] = [
	{
		event_id: "", deployment_id: "", project_id: "", level: "INFO", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},
	{
		event_id: "", deployment_id: "", project_id: "", level: "ERROR", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "WARN", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},
	{
		event_id: "", deployment_id: "", project_id: "", level: "INFO", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},
	{
		event_id: "", deployment_id: "", project_id: "", level: "ERROR", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "WARN", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},
	{
		event_id: "", deployment_id: "", project_id: "", level: "INFO", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},
	{
		event_id: "", deployment_id: "", project_id: "", level: "ERROR", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "WARN", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	}, {
		event_id: "", deployment_id: "", project_id: "", level: "SUCCESS", message: `deployment.updates
Received message: Welcome its working
{"eventId":"38a86d69-a1b8a1b8-4f12-a488-5ff2bf61a489","eventTypa1b8-4f12-a488-5ff2bf61a489","eventTypa1b8-4f12-a488-5ff2bf61a489","eventTypa1b8-4f12-a488-5ff2bf61a489","eventTyp-4f12-a488-5ff2bf61a489","eventTyp`, timestamp: new Date().toISOString()
	},

];

const logSlice = createSlice({
	name: "logs",
	initialState: [...initialState, ...initialState, ...initialState, ...initialState],
	reducers: {
		addLog(state, action: PayloadAction<Log>) {
			if (action.payload && action.payload.message) {
				state.push(action.payload);
			}
		},
		addLogs(state, action: PayloadAction<Log[]>) {
			if (action.payload && action.payload.length > 0) {
				return [...state, ...action.payload]
			}
		},
		clearLogs(state) {
			return [];
		}

	},

},

)

export const { addLog, clearLogs } = logSlice.actions
export default logSlice.reducer