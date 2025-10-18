import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
	id?: string | null;
	name?: string | null;
	email?: string | null;
	access_token?: string | null;
	isAuthenticated?: boolean;
}

const initialState: UserState = {
	id: null,
	name: null,
	email: null,
	isAuthenticated: false,
	access_token: null,
};
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.email = action.payload.email;
			state.access_token = action.payload.access_token
		},
		clearUser(state) {
			state.id = null;
			state.name = null;
			state.email = null;
			state.access_token = null
		},
		restoreAuth: (state) => {
			const token = localStorage.getItem('access_token');
			if (token) {
				state.access_token = token
			}
		},
	},

})

export const { clearUser, setUser, restoreAuth } = userSlice.actions
export default userSlice.reducer