export interface ToggleLikeResponse {
  action: string;
  isLiked: boolean;
  like?: {
    id: string;
    createdAt: string;
  };
  message?: string;
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface ToggleLikeRequest {
    type: string;
    postId?: string;
    commentId?: string;
    childCommentId?: string;
}