import { IGetAllPosts } from "@/types/post.type";
import { sendRequest } from "@/utils/api";

const POST_BASE_URL = `/api/v1/posts`;

const getAllPosts = async (data: IGetAllPosts): Promise<IBackendRes<any>> => {
    const response = await sendRequest<IBackendRes<any>>({
        url: `${POST_BASE_URL}?current=${data.current}&pageSize=${data.pageSize}`,
        method: "GET",
        // KHÔNG cần headers, KHÔNG cần truyền access_token
    });
    return response;
};


export { getAllPosts };
