export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: Record<string, unknown>; // hoặc cụ thể hơn nếu có
        queryParams?: Record<string, string | number | boolean>;
        useCredentials?: boolean;
        headers?: Record<string, string>;
        nextOption?: Partial<import("axios").AxiosRequestConfig>;
    }
    interface IRequestFetch {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }


    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
    }

    interface ILogin {
        user: {
            id: string;
            username: string;
            email: string;
            name: string;
            role: string;
            image: string;
            avatarColor: string;
        };
        access_token: string;
    }
}
