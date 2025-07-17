export interface ICreateCommentRequest {
    content: string;
    postId?: string;
}

export interface IComment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    timeBefore: string;
    childCommentsCount: number;
    likeCount: number;
    isLiked: boolean;
    isAuthor: boolean;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        image: string;
        avatarColor: string;
    };
}
export interface IGetCommentPagination {
    current?: number;
    pageSize?: number;
    postId: string;
}
//Childcomment type
export interface IChildComment {
    id: string;
    user: {
        id: string;
        username: string;
        name: string;
        image?: string;
        avatarColor?: string;
    };
    content: string;
    likeCount: number;
    isLiked: boolean;
    timeBefore?: string;
    createdAtFormat: string;
}
export interface IGetChildCommentPaginationResponse {
    result: IChildComment[];
    totalPages: number;
}
export interface IGetChildCommentPaginationRequest {
    current?: number;
    pageSize?: number;
    commentId: string;
}

export interface IPostChildCommentRequest {
    content: string;
    commentId: string;
}
export interface GetAllCommentsPagination {
    current: number;
    totalPages: number;
    results: IComment[];
}
