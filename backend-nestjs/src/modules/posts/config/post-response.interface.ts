export interface PostResponse {
  id: string;
  content: string;
  mediaType: string;
  mediaURL?: string;
  photos?: PhotoResponse[];
  user: UserResponse;
  createdAt: string;
  createdAtFormatted: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
}

export interface PhotoResponse {
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
