import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { Log } from "@/types/Log";



export const logsApis = createApi({
	reducerPath: "logsApi",
	baseQuery: axiosBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT as string
	}),
	tagTypes: ["Logs"],
	endpoints: (builder) => ({
		getDeploymentLogs: builder.query<Log[], { deploymentId: string }>({
			query: ({ deploymentId }) => ({
				url: `/deployments/${deploymentId}/logs`,
				method: "get"
			}),
			transformResponse: (data: any) => {
				return data.logs
			},
			providesTags: (result, error, { deploymentId }) =>
				result
					? [
						...result.map(({ event_id }) => ({ type: 'Logs' as const, event_id })),
						{ type: 'Logs', id: `DEPLOYMENT_${deploymentId}` }
					]
					: [{ type: 'Logs', id: `DEPLOYMENT_${deploymentId}` }]
		}),

	})
})

export const { useGetDeploymentLogsQuery } = logsApis