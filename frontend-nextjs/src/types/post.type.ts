export enum MediaType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
}

export interface IGetAllPosts {
    current: number;
    pageSize: number;
}
interface IUser {
    id: string;
    username: string;
    name: string;
    avatarColor: string;
    image: string;
}
interface IUpload {
    id: string;
    url: string;
    type: string;
}
export interface IPost {
    id: string;
    user: IUser;
    uploads?: IUpload[];
    content: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    commentCount: number;
    timeBefore: string;
    isLiked?: boolean;
    isAuthor?: boolean;
}

export interface GetAllPostsPagination {
  current: number;
  totalPages: number;
  results: IPost[]
}

export interface DeletePostResponse {
    deleted: boolean;
}

