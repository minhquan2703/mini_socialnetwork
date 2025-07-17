import { ToggleLikeRequest, ToggleLikeResponse } from "@/types/like.type";
import { sendRequest } from "@/utils/api";

const LIKE_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`;

const postToggleLike = async (data: ToggleLikeRequest): Promise<IBackendRes<ToggleLikeResponse>> => {
    const { type, postId, commentId, childCommentId } = data;
    const response = await  sendRequest<IBackendRes<ToggleLikeResponse>>({
        url: `${LIKE_BASE_URL}/toggle`,
        method: "POST",
        body: {
            type,
            postId,
            commentId,
            childCommentId,
        },
    })
    return response
}

export { postToggleLike };
