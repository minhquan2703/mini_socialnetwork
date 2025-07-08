import { sendRequest } from "@/utils/api";

const CHAT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`;

const getChatRoom = async (roomId: string): Promise<IBackendRes<any>> => {
    const response = await sendRequest<IBackendRes<any>>({
        url: `${CHAT_BASE_URL}/${roomId}`,
        method: "GET",
    });
    return response;
};
export { getChatRoom }