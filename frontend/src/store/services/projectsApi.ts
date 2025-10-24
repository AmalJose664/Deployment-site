import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Project } from '@/types/Project';
import { ProjectFormType } from '@/lib/schema/project';
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
		getProjectById: builder.query<Project, { id: string, params: { user?: string } }>({
			query: ({ id, params }) => ({ url: `/projects/${id}`, method: 'get', params }),
			transformResponse(baseQueryReturnValue: any) {
				return baseQueryReturnValue.project as Project
			},
			providesTags: (result, error, { id }) => [{ type: 'Projects', id }]
		}),
		createProject: builder.mutation<Project, ProjectFormType>({
			query: (project) => ({
				url: "/projects",
				method: "POST",
				data: project,
			}),
			invalidatesTags: ["Projects"]
		})
	})
})


export const {
	useGetProjectsQuery, useCreateProjectMutation, useGetProjectByIdQuery
} = projectApis;

