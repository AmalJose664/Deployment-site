import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Deployment, DeploymentFilesType } from "@/types/Deployment";

export const deployemntApis = createApi({
	reducerPath: "deployemntsApi",
	baseQuery: axiosBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT as string
	}),
	tagTypes: ['Deployments'],
	endpoints: (builder) => ({
		getDeployments: builder.query<Deployment[], {}>({
			query: () => ({ url: '/deployments', method: 'get' }),
			transformResponse: (data: any) => {
				return data.deployments
			},
			providesTags: (result) =>
				result
					? [
						...result.map(({ _id }) => ({ type: 'Deployments' as const, _id })),
						{ type: 'Deployments', id: 'LIST' }
					]
					: [{ type: 'Deployments', id: 'LIST' }]
		}),
		getProjectDeployments: builder.query<Deployment[], string>({
			query: (projectId) => ({ url: `/projects/${projectId}/deployments`, method: 'get' }),
			transformResponse: (data: any) => {
				return data.deployments
			},
			providesTags: (result, error, projectId) =>
				result
					? [
						...result.map(({ _id }) => ({ type: 'Deployments' as const, _id })),
						{ type: 'Deployments', id: `PROJECT_${projectId}` }
					]
					: [{ type: 'Deployments', id: `PROJECT_${projectId}` }]

		}),



		getDeploymentById: builder.query<Deployment, { id: string, params: {} }>({
			query: ({ id, params }) => ({ url: '/deployments/' + id, method: 'get', params }),
			transformResponse: (data: any) => {
				return data.deployment
			},
			providesTags: (result, error, { id }) => [{ type: 'Deployments', id }]
		}),
		getDeploymentFiles: builder.query<DeploymentFilesType, { id: string, params: {} }>({
			query: ({ id, params }) => ({ url: '/deployments/' + id + "/files", method: 'get', params }),
			keepUnusedDataFor: 20 * 60,
			transformResponse: (data: any) => {
				return data.deployment
			},
			providesTags: (result, error, { id }) => [{ type: 'Deployments', id: "files__" + id, }]
		}),
		createDeployment: builder.mutation<Deployment, string>({
			query: (projectId) => ({ url: `/projects/${projectId}/deployments`, method: "POST", data: { projectId } }),
			invalidatesTags: (result, error, projectId) => [{ type: 'Deployments', id: 'LIST' }],
		})
	})

})

export const {
	useCreateDeploymentMutation, useGetDeploymentFilesQuery,
	useGetDeploymentByIdQuery, useGetProjectDeploymentsQuery,
	useGetDeploymentsQuery
} = deployemntApis