export interface IPostComment {
    content: string;
    postId?: string;
    photoId?: string;
}
export interface IPostCommentResponse {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    timeBefore: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        image: string;
        avatarColor: string;
    };
}
