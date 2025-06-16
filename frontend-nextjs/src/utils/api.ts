import axios from "axios";
import { getSession } from "next-auth/react";
import queryString from "query-string";

// 1. Tạo axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// 2. Gắn interceptor tự động thêm access_token vào mọi request
// api.interceptors.request.use(
//     async (config) => {
//         const session = await getSession();
//         const token = session?.user?.access_token;
//         if (token) {
//             config.headers = {
//                 ...config.headers,
//                 Authorization: `Bearer ${token}`,
//             };
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );
api.interceptors.request.use(
    async (config) => {
        if (typeof window !== "undefined") {
            // Client: có thể dùng getSession
            const session = await getSession();
            const token = session?.user?.access_token;
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }
        // Server: phải tự truyền token qua config.headers từ chỗ gọi
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Hàm gửi request (gửi JSON)
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
        console.log("Request headers:", config.headers);
        return res.data;
    } catch (error: any) {
        return {
            statusCode: error.response?.status,
            message: error.response?.data?.message ?? error.message ?? "",
            error: error.response?.data?.error ?? "",
        } as T;
    }
};

// 4. Hàm gửi request file (FormData, upload file, v.v)
// export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
//     let {
//         url,
//         method,
//         body,
//         queryParams = {},
//         useCredentials = false,
//         headers = {},
//         nextOption = {},
//     } = props;

//     if (queryParams && Object.keys(queryParams).length > 0) {
//         url = `${url}?${queryString.stringify(queryParams)}`;
//     }

//     const config: any = {
//         url,
//         method,
//         headers: { ...headers }, // Không set Content-Type, để axios tự detect boundary
//         ...nextOption,
//     };

//     if (body) config.data = body;
//     if (useCredentials) config.withCredentials = true;

//     try {
//         const res = await api.request<T>(config);
//         return res.data;
//     } catch (error: any) {
//         return {
//             statusCode: error.response?.status,
//             message: error.response?.data?.message ?? error.message ?? "",
//             error: error.response?.data?.error ?? "",
//         } as T;
//     }
// };
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
            // QUAN TRỌNG: Không set Content-Type khi gửi FormData
            // Axios sẽ tự động set với boundary đúng
        },
        ...nextOption,
    };

    // QUAN TRỌNG: Với FormData, phải gửi trực tiếp, không wrap trong object
    if (body instanceof FormData) {
        config.data = body; // Gửi FormData trực tiếp
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
