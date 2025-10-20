import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { AxiosError, AxiosRequestConfig } from "axios"
import axiosInstance from "@/lib/axios"


export const axiosBaseQuery = (
	{ baseUrl }: { baseUrl?: string } = { baseUrl: "" }
): BaseQueryFn<{
	url: string,
	method: AxiosRequestConfig['method'],
	data?: AxiosRequestConfig['data'],
	params?: AxiosRequestConfig['params'],
}, unknown, unknown> =>
	async ({ url, method, data, params }) => {
		try {
			const result = await axiosInstance({
				url: baseUrl + url, // fll here
				method,
				data,
				params
			})
			return { data: result.data };
		} catch (axiosError) {
			const err = axiosError as AxiosError
			return {
				error: {
					status: err.response?.status,
					data: err.response?.data || err.message
				}
			}
		}
	}
