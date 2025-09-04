import { IDetailRoom, IMessage, IRoom } from "@/types/room.type";
import { sendRequest, sendRequestFile } from "@/utils/apiAxios";

const CHAT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`;
const ROOM_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/rooms`;

const getMessages = async (roomId: string): Promise<IBackendRes<IMessage>> => {
    const response = await sendRequest<IBackendRes<IMessage>>({
        url: `${CHAT_BASE_URL}/${roomId}`,
        method: "GET",
    });
    return response;
};

const createMessage = async (data: FormData): Promise<IBackendRes<any>> => {
    const response = await sendRequestFile<IBackendRes<any>>({
        url: `${CHAT_BASE_URL}`,
        method: "POST",
        body: data,
    });
    return response;
};

const getListRooms = async (): Promise<IBackendRes<IRoom[]>> => {
    const response = await sendRequest<IBackendRes<IRoom[]>>({
        url: `${ROOM_BASE_URL}/all`,
        method: "GET",
    });
    return response;
};

const getDetailRoom = async (roomId: string): Promise<IBackendRes<IDetailRoom>> => {
    const response = await sendRequest<IBackendRes<IDetailRoom>>({
        url: `${ROOM_BASE_URL}/detail/${roomId}`,
        method: "GET",
    });
    return response;
};

const getFilesInRoom = async (roomId: string): Promise<IBackendRes<any>> => {
    const response = await sendRequest<IBackendRes<any>>({
        url: `${ROOM_BASE_URL}/files/${roomId}`,
        method: "GET",
    });
    return response;
};

const postCreatePrivatedRoom = async (data: any): Promise<IBackendRes<any>> => {
    const { receiverId, type } = data;
    const response = await sendRequest<IBackendRes<any>>({
        url: `${ROOM_BASE_URL}/private`,
        method: "POST",
        body: { receiverId, type },
    });
    return response;
};

export { getMessages, postCreatePrivatedRoom, getListRooms, getDetailRoom, createMessage, getFilesInRoom };
