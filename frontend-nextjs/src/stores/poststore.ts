import { create } from "zustand";
import { getAllPosts } from "@/services/post.service";
import { postToggleLike } from "@/services/like.service";

interface Post {
    id: string;
    content: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    user: any;
    photos?: any[];
    mediaType?: string;
    mediaURL?: string;
    createdAt: string;
    timeBefore: string;
}

interface PostStore {
    // State
    posts: Post[];
    loading: boolean;
    currentPage: number;
    maxPage: number;

    // Actions
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    updatePost: (postId: string, updates: Partial<Post>) => void;
    toggleLikeOptimistic: (postId: string) => void;
    updateCommentCount: (postId: string, increment: number) => void;
    fetchPosts: (page: number) => Promise<void>;
    loadMore: () => Promise<void>;

    //like handling with optimistic update
    handleLike: (postId: string) => Promise<void>;
}

// Request cache to prevent duplicate calls
const likeRequestCache = new Map<string, Promise<any>>();

const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
    loading: true,
    currentPage: 1,
    maxPage: 1,

    setPosts: (posts) => set({ posts }),

    addPost: (post) =>
        set((state) => ({
            posts: [post, ...state.posts],
        })),

    updatePost: (postId, updates) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post.id === postId ? { ...post, ...updates } : post
            ),
        })),

    toggleLikeOptimistic: (postId) =>
        set((state) => ({
            posts: state.posts.map((post) => {
                if (post.id !== postId) return post;

                const isLiked = !post.isLiked;
                const baseCount =
                    typeof post.likeCount === "number" ? post.likeCount : 0;
                const likeCount = Math.max(0, baseCount + (isLiked ? 1 : -1));

                console.log("Before likeCount:", post.likeCount);
                console.log("After likeCount:", likeCount);

                return {
                    ...post,
                    isLiked,
                    likeCount,
                };
            }),
        })),

    updateCommentCount: (postId, increment) => {
        console.log(
            `Updating comment count for post ${postId} by ${increment}`
        );
        set((state) => ({
            posts: state.posts.map((post) => {
                if (post.id !== postId) return post;
                const newCount = Math.max(
                    0,
                    (post.commentCount || 0) + increment
                );
                console.log(
                    `Post ${postId} comment count: ${post.commentCount} -> ${newCount}`
                );
                return { ...post, commentCount: newCount };
            }),
        }));
    },

    fetchPosts: async (page) => {
        set({ loading: true });
        try {
            const res = await getAllPosts({ current: page, pageSize: 7 });
            if (res?.data) {
                set({
                    posts: res.data.results,
                    maxPage: res.data.totalPages,
                    currentPage: page,
                    loading: false,
                });
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            set({ loading: false });
        }
    },

    loadMore: async () => {
        const { currentPage, maxPage } = get();
        if (currentPage < maxPage) {
            await get().fetchPosts(currentPage + 1);
        }
    },

    handleLike: async (postId) => {
        // Check cache
        if (likeRequestCache.has(postId)) {
            return likeRequestCache.get(postId);
        }

        // Optimistic update
        get().toggleLikeOptimistic(postId);

        // API call
        const likePromise = (async () => {
            try {
                const res = await postToggleLike({
                    type: "post",
                    postId: postId,
                });

                if (res?.data) {
                    // Update with server response
                    get().updatePost(postId, {
                        isLiked: res.data.isLiked,
                        likeCount: res.data.likeCount,
                    });
                }
            } catch (error) {
                // Revert on error
                console.error("Like error:", error);
                get().toggleLikeOptimistic(postId);
                throw error;
            } finally {
                setTimeout(() => {
                    likeRequestCache.delete(postId);
                }, 500);
            }
        })();

        likeRequestCache.set(postId, likePromise);
        return likePromise;
    },
}));

export default usePostStore;
