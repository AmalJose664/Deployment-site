import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Project } from '@/types/Project';
interface GetProjectsParams {
	limit?: number;
	search?: string;
	page?: number;
}
export const projectApis = createApi({
	reducerPath: "projectsApi",
	baseQuery: axiosBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT as string
	}),
	tagTypes: ['Projects'],
	endpoints: (builder) => ({
		getProjects: builder.query<Project[], GetProjectsParams>({
			query: (params) => ({ url: '/projects', method: 'get', params }),
			transformResponse(baseQueryReturnValue: any) {
				return baseQueryReturnValue.projects as Project[]
			},
			providesTags: ['Projects'],
		}),
	})
})


export const {
	useGetProjectsQuery
} = projectApis;

