import { PostReportRequest } from "@/types/report.type";
import { sendRequest } from "@/utils/apiAxios";


const REPORT_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports`;


const postReport = async (
    data: PostReportRequest
): Promise<IBackendRes<boolean>> => {
    const { id, reason, content, type } = data;
    const response = await sendRequest<IBackendRes<boolean>>({
        url: `${REPORT_BASE_URL}/`,
        method: "POST",
        body: {
            type,
            id,
            reason,
            content,
        },
    });
    return response;
};

export { postReport }