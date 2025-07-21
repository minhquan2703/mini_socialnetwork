import { DeletePostResponse, GetAllPostsPagination, IGetAllPosts, IPost, UpdatePostRequest, UpdatePostResponse } from "@/types/post.type";
import { sendRequest, sendRequestFile } from "@/utils/apiAxios";

const POST_BASE_URL = `/api/v1/posts`;

const getAllPosts = async (data: IGetAllPosts): Promise<IBackendRes<GetAllPostsPagination>> => {
    const { current, pageSize } = data;
    const response = await sendRequest<IBackendRes<GetAllPostsPagination>>({
        url: `${POST_BASE_URL}?current=${current}&pageSize=${pageSize}`,
        method: "GET",
        // KHÔNG cần headers, KHÔNG cần truyền access_token
    });
    return response;
};
const postNewPost = async (formData: FormData): Promise<IBackendRes<IPost>> => {
    const response = await sendRequestFile<IBackendRes<IPost>>({
        url: `${POST_BASE_URL}`,
        method: "POST",
        body: formData,
    });
    return response;
};
const deleteOnePost = async (postId: string): Promise<IBackendRes<DeletePostResponse>> => {
    const response = await sendRequest<IBackendRes<DeletePostResponse>>({
        url: `${POST_BASE_URL}/${postId}`,
        method: "DELETE",
    });
    return response;
};

const updatePost = async (data: UpdatePostRequest): Promise<IBackendRes<UpdatePostResponse>> => {
    const { id, content } = data
    const response = await sendRequest<IBackendRes<UpdatePostResponse>>({
        url: `${POST_BASE_URL}`,
        method: "PUT",
        body: {
            id,
            content,
        }
    });
    return response;
};

export { getAllPosts, postNewPost, deleteOnePost, updatePost };
