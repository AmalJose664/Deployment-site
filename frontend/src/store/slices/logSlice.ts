import { Log } from "@/types/Log";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: Log[] = [];

const logSlice = createSlice({
	name: "logs",
	initialState,
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

export const { addLog, clearLogs, addLogs } = logSlice.actions
export default logSlice.reducer