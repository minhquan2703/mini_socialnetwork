export const runtime = 'nodejs';

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import queryString from "query-string";

export interface IRequest {
    url: string;
    method: AxiosRequestConfig["method"];
    body?: unknown;
    queryParams?: Record<string, unknown>;
    useCredentials?: boolean;
    headers?: Record<string, string>;
    nextOption?: Partial<AxiosRequestConfig>;
}
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(
    async (config) => {
        if (typeof window !== "undefined") {
            const session = await getSession();
            const token = session?.user?.access_token;
            if (token) {
                config.headers?.set?.("Authorization", `Bearer ${token}`);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const sendRequest = async <T>(props: IRequest): Promise<T> => {
    const {
        url: originalUrl,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
    } = props;

    const url =
        queryParams && Object.keys(queryParams).length > 0
            ? `${originalUrl}?${queryString.stringify(queryParams)}`
            : originalUrl;

    const config: AxiosRequestConfig = {
        url,
        method,
        headers: { "Content-Type": "application/json", ...headers },
        ...nextOption,
    };

    if (body) config.data = body;
    if (useCredentials) config.withCredentials = true;

    try {
        const res: AxiosResponse<T> = await api.request<T>(config);
        return res.data;
    } catch (error) {
        const err = error as any;
        return {
            statusCode: err.response?.status,
            message: err.response?.data?.message ?? err.message ?? "",
            error: err.response?.data?.error ?? "",
        } as T;
    }
};

export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
    const {
        url: originalUrl,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        
    } = props;

    const url =
        queryParams && Object.keys(queryParams).length > 0
            ? `${originalUrl}?${queryString.stringify(queryParams)}`
            : originalUrl;

    const config: AxiosRequestConfig = {
        url,
        method,
        headers: {
            ...headers,
        },
        ...nextOption,
    };

    config.data = body;

    if (useCredentials) config.withCredentials = true;

    try {
        const res: AxiosResponse<T> = await api.request<T>(config);
        return res.data;
    } catch (error) {
        const err = error as any;
        return {
            statusCode: err.response?.status,
            message: err.response?.data?.message ?? err.message ?? "",
            error: err.response?.data?.error ?? "",
        } as T;
    }
};

export default api;
