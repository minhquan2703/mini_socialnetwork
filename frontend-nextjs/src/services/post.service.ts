import { IGetAllPosts } from "@/types/post.type";
import { sendRequest, sendRequestFile } from "@/utils/api";

const POST_BASE_URL = `/api/v1/posts`;

const getAllPosts = async (data: IGetAllPosts): Promise<IBackendRes<any>> => {
    const response = await sendRequest<IBackendRes<any>>({
        url: `${POST_BASE_URL}?current=${data.current}&pageSize=${data.pageSize}`,
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

export { getAllPosts, postNewOne };
