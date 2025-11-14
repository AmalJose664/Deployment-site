import axiosInstance from "@/lib/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Project {
	id: string;
	name: string;
	description?: string;
}
interface ProjectsState {
	items: Project[];
	loading: boolean;
	error: string | null;
}
const initialState: ProjectsState = {
	items: [],
	loading: false,
	error: null,
};

export const fetchProjects = createAsyncThunk(
	'projects/fetchProjects',
	async () => {
		const response = await axiosInstance.get("/projects/")
		return response.data.projects
	}
);

const projectSlice = createSlice({
	name: "projects",
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder.addCase(fetchProjects.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		builder.addCase(fetchProjects.fulfilled, (state, action) => {
			state.loading = false;
			state.items = action.payload;
			state.error = null;
		})
		builder.addCase(fetchProjects.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?? 'Failed to load projects';
		})
	}

},

)

export const { } = projectSlice.actions
export default projectSlice.reducer