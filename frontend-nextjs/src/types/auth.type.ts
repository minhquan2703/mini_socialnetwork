import { SetStateAction } from "react";

// Authentication related types
export interface IRegister {
    name: string;
    email: string;
    username: string;
    password: string;
}
export interface IResendCode {
    id: SetStateAction<string>;
    username: string;
    email: string;
}
export interface IVerifyAccount {
    id: string;
    code: string;
}

interface IUserFullProfile {
    id: string;
    email: string;
    username: string;
    role: "USER" | "ADMIN";
    bio: string | null;
    avatarColor: string | null;
    isActive: boolean;
    codeExpired: string;
    createdAt: string;
}

export interface UserListResponseData {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    results: IUserFullProfile[];
}

export interface GetUserPagination {
    current: number;
    pageSize: number;
}
