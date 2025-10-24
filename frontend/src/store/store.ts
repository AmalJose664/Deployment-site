import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice"
import projectsReducer from "./slices/projectSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { projectApis } from './services/projectsApi'
import { deployemntApis } from './services/deploymentApi'

export const makeStore = () => {
	return configureStore({
		reducer: {
			userReducer,
			projects: projectsReducer,
			[projectApis.reducerPath]: projectApis.reducer,
			[deployemntApis.reducerPath]: deployemntApis.reducer
		},
		middleware: (gDM) => gDM().concat(projectApis.middleware, deployemntApis.middleware),
	})
}

export const store = makeStore()
export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;