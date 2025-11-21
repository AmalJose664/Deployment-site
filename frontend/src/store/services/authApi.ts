import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { User } from "@/types/User";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: axiosBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT as string }),
	tagTypes: ['Auth'],
	refetchOnMountOrArgChange: false,
	endpoints: (builder) => ({
		getUser: builder.query<User, void>({
			query: () => ({ url: "/auth/me", method: 'get' }),
			keepUnusedDataFor: 7 * 60,

			transformResponse: (data: any) => {
				return data.user
			},
			providesTags: (result, error,) => [{ type: 'Auth', id: result?._id || "" }]
		}),
		logout: builder.mutation<{ success: boolean }, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			invalidatesTags: [{ type: "Auth" }],
		}),
	}),
})

export const { useGetUserQuery, useLogoutMutation } = authApi