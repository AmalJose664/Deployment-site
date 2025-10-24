import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Deployment } from "@/types/Deployment";

export const deployemntApis = createApi({
	reducerPath: "deployemntsApi",
	baseQuery: axiosBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT as string
	}),
	tagTypes: ['Deployments',],
	endpoints: (builder) => ({
		getDeployments: builder.query<Deployment[], {}>({
			query: () => ({ url: '/deployment', method: 'get' }),
			providesTags: ['Deployments']
		}),
		getDeploymentById: builder.query<Deployment, { id: string, params: {} }>({
			query: ({ id, params }) => ({ url: '/deployment/' + id, method: 'get', params }),
			transformResponse: (data: any) => {
				return data.deployment
			},
			providesTags: (result, error, { id }) => [{ type: 'Deployments', id }]
		}),
		createDeployment: builder.mutation<Deployment, string>({
			query: (projectId) => ({ url: "/deployment/new", method: "POST", data: { projectId } }),
			invalidatesTags: (result, error, projectId) => [{ type: 'Deployments', id: 'LIST' }],
		})
	})

})

export const {
	useCreateDeploymentMutation,
	useGetDeploymentByIdQuery,
	useGetDeploymentsQuery } = deployemntApis