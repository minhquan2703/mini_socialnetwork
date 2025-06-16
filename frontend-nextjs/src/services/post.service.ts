import { IGetAllPosts } from "@/types/post.type";
import { sendRequest, sendRequestFile } from "@/utils/api";

const POST_BASE_URL = `/api/v1/posts`;

const getAllPosts = async (data: IGetAllPosts): Promise<IBackendRes<any>> => {
    const { current, pageSize } = data;
    const response = await sendRequest<IBackendRes<any>>({
        url: `${POST_BASE_URL}?current=${current}&pageSize=${pageSize}`,
        method: "GET",
        // KHÔNG cần headers, KHÔNG cần truyền access_token
    });
    return response;
};
const postNewOne = async (formData: FormData): Promise<IBackendRes<any>> => {
    const response = await sendRequestFile<IBackendRes<any>>({
        url: `${POST_BASE_URL}/create`,
        method: "POST",
        body: formData,
    });
    return response;
};
const deleteOnePost = async (postId: string): Promise<IBackendRes<any>> => {
    const response = await sendRequest<IBackendRes<any>>({
        url: `${POST_BASE_URL}/${postId}`,
        method: "DELETE",
    });
    return response;
};

export { getAllPosts, postNewOne, deleteOnePost };
