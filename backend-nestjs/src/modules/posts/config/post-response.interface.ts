
export interface PostResponse {
  id: string;
  content: string;
  user: UserResponse;
  uploads?: UploadResponse[];
  createdAt: string;
  createdAtFormatted: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
}

export interface UploadResponse {
  id: string;
  url: string;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  image?: string;
}

export interface PostListResponse {
  results: PostResponse[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
