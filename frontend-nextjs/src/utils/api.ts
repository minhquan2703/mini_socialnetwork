import axios from "axios";
import { getSession } from "next-auth/react";
import queryString from "query-string";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(
    async (config) => {
        if (typeof window !== "undefined") {
            //client: có thể dùng getSession
            const session = await getSession();
            const token = session?.user?.access_token;
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }
        //server: phải tự truyền token qua config.headers từ chỗ gọi
        return config;
    },
    (error) => Promise.reject(error)
);

// 3.Hàm gửi request (gửi JSON)
export const sendRequest = async <T>(props: IRequest): Promise<T> => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
    } = props;

    if (queryParams && Object.keys(queryParams).length > 0) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    const config: any = {
        url,
        method,
        headers: { "Content-Type": "application/json", ...headers },
        ...nextOption,
    };

    if (body) config.data = body;
    if (useCredentials) config.withCredentials = true;

    try {
        const res = await api.request<T>(config);
        return res.data;
    } catch (error: any) {
        return {
            statusCode: error.response?.status,
            message: error.response?.data?.message ?? error.message ?? "",
            error: error.response?.data?.error ?? "",
        } as T;
    }
};

export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
    } = props;

    if (queryParams && Object.keys(queryParams).length > 0) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    const config: any = {
        url,
        method,
        headers: {
            ...headers,
            //QUAN TRỌNG: Không set Content-Type khi gửi FormData
            //axios sẽ tự động set với boundary đúng
        },
        ...nextOption,
    };

    if (body instanceof FormData) {
        config.data = body; 
    } else {
        config.data = body;
    }

    if (useCredentials) config.withCredentials = true;

    try {
        const res = await api.request<T>(config);
        return res.data;
    } catch (error: any) {
        return {
            statusCode: error.response?.status,
            message: error.response?.data?.message ?? error.message ?? "",
            error: error.response?.data?.error ?? "",
        } as T;
    }
};

export default api;
