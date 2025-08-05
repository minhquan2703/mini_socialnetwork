export interface PostReportRequest {
    id: string;
    reason: string;
    content: string;
    type: string; //"POST", "COMMENT", "CHILDCOMMENT"
}