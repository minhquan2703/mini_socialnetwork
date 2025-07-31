import {
    DeleteCommentResponse,
    GetAllCommentsPagination,
    IChildComment,
    IComment,
    ICreateCommentRequest,
    IGetChildCommentPaginationRequest,
    IGetChildCommentPaginationResponse,
    IGetCommentPagination,
    IPostChildCommentRequest,
    UpdateChildCommentRequest,
    UpdateCommentRequest,
} from "@/types/comment.type";
import { sendRequest } from "@/utils/apiAxios";

const COMMENT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`;
const CHILDCOMMENT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/child-comments`;

const postComment = async (
    data: ICreateCommentRequest
): Promise<IBackendRes<IComment>> => {
    const { content, postId } = data;
    const response = await sendRequest<IBackendRes<IComment>>({
        url: `${COMMENT_BASE_URL}/`,
        method: "POST",
        body: {
            content,
            postId,
        },
    });
    return response;
};
const getAllCommentOfOnePost = async (
    data: IGetCommentPagination
): Promise<IBackendRes<GetAllCommentsPagination>> => {
    const { current, pageSize, postId } = data;
    const response = await sendRequest<IBackendRes<GetAllCommentsPagination>>({
        url: `${COMMENT_BASE_URL}/all/?current=${current}&pageSize=${pageSize}&postId=${postId}`,
        method: "GET",
    });
    return response;
};

const postChildComment = async (data: IPostChildCommentRequest): Promise<IBackendRes<IChildComment>> => {
    const { content, commentId } = data;
    const response = await sendRequest<IBackendRes<IChildComment>>({
        url: `${CHILDCOMMENT_BASE_URL}/`,
        method: "POST",
        body: {
            content,
            commentId,
        },
    });
    return response;
};

const getChildComment = async (data: IGetChildCommentPaginationRequest): Promise<IBackendRes<IGetChildCommentPaginationResponse>> => {
    const { current, pageSize, commentId } = data;
    const response = await sendRequest<IBackendRes<IGetChildCommentPaginationResponse>>({
        url: `${COMMENT_BASE_URL}/childcomment?commentId=${commentId}&current=${current}&pageSize=${pageSize}`,
        method: "GET",
    });
    return response
};

const deleteComment = async (commentId: string): Promise<IBackendRes<DeleteCommentResponse>> => {
    const response = await sendRequest<IBackendRes<DeleteCommentResponse>>({
        url: `${COMMENT_BASE_URL}/${commentId}`,
        method: "DELETE",
    });
    return response;
};

const updateComment = async (data: UpdateCommentRequest): Promise<IBackendRes<any>> => {
    const { id, content } = data
    const response = await sendRequest<IBackendRes<any>>({
        url: `${COMMENT_BASE_URL}`,
        method: "PUT",
        body: {
            id,
            content,
        }
    });
    return response;
};
const deleteChildComment = async (id: string): Promise<IBackendRes<DeleteCommentResponse>> => {
    const response = await sendRequest<IBackendRes<DeleteCommentResponse>>({
        url: `${CHILDCOMMENT_BASE_URL}/${id}`,
        method: "DELETE",
    });
    return response;
};

const updateChildComment = async (data: UpdateChildCommentRequest): Promise<IBackendRes<any>> => {
    const { id, content } = data
    const response = await sendRequest<IBackendRes<any>>({
        url: `${CHILDCOMMENT_BASE_URL}`,
        method: "PUT",
        body: {
            id,
            content,
        }
    });
    return response;
};
export { postComment, getAllCommentOfOnePost, postChildComment, getChildComment, deleteComment, updateComment, updateChildComment, deleteChildComment };
