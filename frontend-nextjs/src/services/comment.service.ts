import { IPostComment, IPostCommentResponse } from "@/types/comment.type";
import { sendRequest } from "@/utils/api";


const COMMENT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`;

const postComment = async (data: IPostComment): Promise<IBackendRes<IPostCommentResponse>> => {
    const { content, postId, photoId } = data;
    const response = await sendRequest<IBackendRes<IPostCommentResponse>>({
        url: `${COMMENT_BASE_URL}/`,
        method: "POST",
        body: {
            content,
            postId,
            photoId,
        },
    });
    return response;
};
const getAllCommentOfOnePost = async (data: any): Promise<IBackendRes<any>> => {
    const { current, pageSize, postId } = data;
    const response = await sendRequest<IBackendRes<any>>({
        url: `${COMMENT_BASE_URL}/getallcomment-post/?current=${current}&pageSize=${pageSize}&postId=${postId}`,
        method: "GET",
    })
    return response;
};
export { postComment, getAllCommentOfOnePost };
