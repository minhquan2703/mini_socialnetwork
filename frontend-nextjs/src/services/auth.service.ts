import {
    BlockUser,
    IRegister,
    IResendCode,
    IVerifyAccount,
    UnblockUser,
} from "@/types/auth.type";
import { UserInRoom } from "@/types/room.type";
import { sendRequest, sendRequestFile } from "@/utils/apiAxios";

const AUTH_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths`;
const USER_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`;

const postAuthRegister = async (
    data: IRegister
): Promise<IBackendRes<IRegister>> => {
    const { name, username, email, password } = data;
    const response = await sendRequest<IBackendRes<IRegister>>({
        url: `${AUTH_BASE_URL}/register`,
        method: "POST",
        body: {
            name,
            username,
            email,
            password,
        },
    });
    return response;
};

const putAvatar = async (formData: FormData): Promise<IBackendRes<any>> => {
    const response = await sendRequestFile<IBackendRes<any>>({
        url: `${USER_BASE_URL}/avatar`,
        method: "PUT",
        body: formData,
    });
    return response;
};

const postAuthVerifyAccount = async (
    data: IVerifyAccount
): Promise<IBackendRes<IVerifyAccount>> => {
    const response = await sendRequest<IBackendRes<IVerifyAccount>>({
        url: `${AUTH_BASE_URL}/verify`,
        method: "POST",
        body: {
            id: data.id,
            code: data.code,
        },
    });
    return response;
};
const postResendCode = async (
    data: IResendCode
): Promise<IBackendRes<IResendCode>> => {
    const { username, email } = data;
    const response = await sendRequest<IBackendRes<IResendCode>>({
        url: `${AUTH_BASE_URL}/resend-active-code`,
        method: "POST",
        body: {
            username,
            email,
        },
    });
    return response;
};

const postBlockUser = async (
    userId: string
): Promise<IBackendRes<BlockUser>> => {
    const response = await sendRequest<IBackendRes<BlockUser>>({
        url: `${USER_BASE_URL}/block/`,
        method: "POST",
        body: {
            blockedUserId: userId,
        },
    });
    return response;
};

const deleteUnblockUser = async (
    userId: string
): Promise<IBackendRes<UnblockUser>> => {
    const response = await sendRequest<IBackendRes<UnblockUser>>({
        url: `${USER_BASE_URL}/block/${userId}`,
        method: "DELETE",
    });
    return response;
};

const getBlockedUsers = async (): Promise<IBackendRes<UserInRoom[]>> => {
    const response = await sendRequest<IBackendRes<UserInRoom[]>>({
        url: `${USER_BASE_URL}/block`,
        method: "GET",
    });
    return response;
}

const getIsBlockedByUsers = async (): Promise<IBackendRes<UserInRoom[]>> => {
    const response = await sendRequest<IBackendRes<UserInRoom[]>>({
        url: `${USER_BASE_URL}/blocked-by`,
        method: "GET",
    });
    return response;
}

export {
    postAuthRegister,
    postAuthVerifyAccount,
    postResendCode,
    putAvatar,
    postBlockUser,
    deleteUnblockUser,
    getBlockedUsers,
    getIsBlockedByUsers,
};
