import { sendRequest } from "@/utils/api";

const LIKE_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`;

const postToggleLike = async (data: any): Promise<IBackendRes<any>> => {
    const { type, postId, commentId, photoId } = data;
    const response = await  sendRequest<IBackendRes<any>>({
        url: `${LIKE_BASE_URL}/toggle`,
        method: "POST",
        body: {
            type,
            postId,
            commentId,
            photoId
        },
    })
    return response
}

export { postToggleLike };
