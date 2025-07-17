"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { deleteOnePost, getAllPosts } from "@/services/post.service";
import { postToggleLike } from "@/services/like.service";
import PostList from "@/components/homepage/list.post";
import SkeletonCard from "@/components/homepage/skeleton.card";
import CreatePostForm from "@/components/homepage/create.post";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import { Button, Typography, Divider } from "antd";
import { IPost } from "@/types/post.type";
import { ToggleLikeResponse } from "@/types/like.type";

export interface HomePageProps{
    handleCommentCountUpdate?: (postId: string, increment: number) => void
    handleLike?: (postId: string) => Promise<ToggleLikeResponse>;
    handleDeletePost?: (postId: string) => void;
    handlePostCreated?: (newPost: IPost) => void;
}

const HomePage = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 7;
    const likeRequestCache = useRef(new Map());

    // Fetch data

    useEffect(() => {
        getDataPosts();
        window.scrollTo(0, 0);
    }, []);

    const getDataPosts = async () => {
        setLoading(true);
        const res = await getAllPosts({ current: current, pageSize: LIMIT });
        if (res && res?.data) {
            setPosts(res.data.results);
        }
        if (res.error) {
            toast.error(res.message);
        }
        setLoading(false);
    };
    const loadMoreData = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = current + 1;

        const res = await getAllPosts({
            current: nextPage,
            pageSize: LIMIT,
        });
        if (res && res?.data) {
            const newPosts = res.data.results;
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setCurrent(res.data.current);
            setHasMore(nextPage < res.data.totalPages);
        } else {
            toast.message(res.message);
        }
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    };

    // Handle function

    const handleLike = useCallback(async (postId: string) => {
        if (likeRequestCache.current.has(postId)) {
            return likeRequestCache.current.get(postId);
        }
        const likePromise = (async () => {
            try {
                const res = await postToggleLike({
                    type: "post",
                    postId: postId,
                });
                if (res && res.data) {
                    //update global state sau khi response
                    setPosts((currentPosts) =>
                        currentPosts.map((post) => {
                            if (post.id !== postId) return post;
                            return {
                                ...post,
                                isLiked: res?.data?.isLiked ?? !post.isLiked,
                                likeCount:
                                    (post.isLiked
                                        ? post.likeCount - 1
                                        : post.likeCount + 1),
                            };
                        })
                    );
                } else {
                    toast.error(res?.message ?? "Đã có lỗi xảy ra");
                }
                return res;
            } catch (error) {
                throw error;
            } finally {
                //clear cache timout 500ms
                setTimeout(() => {
                    likeRequestCache.current.delete(postId);
                }, 500);
            }
        })();

        likeRequestCache.current.set(postId, likePromise);
        console.log('check like promise', likePromise)
        return likePromise;
    }, []);

    const handlePostCreated = useCallback((newPost: IPost) => {
        setPosts((currentPosts) => [newPost, ...currentPosts]);
    }, []);

    const handleCommentCountUpdate = (postId: string, increment: number) => {
        setPosts((currentPosts) =>
            currentPosts.map((post) => {
                if (post.id !== postId) return post;
                return {
                    ...post,
                    commentCount: Math.max(
                        0,
                        (post.commentCount || 0) + increment
                    ),
                };
            })
        );
    };
    const handleDeletePost = async (postIdDeleted: string) => {
        const res = await deleteOnePost(postIdDeleted);
        if (res && res?.data) {
            setPosts((currentPost) =>
                currentPost.filter((post) => post.id !== postIdDeleted)
            );
            toast.success("Xoá bài viết thành công");
        }
        if (res.error && res.message) {
            toast.error(res.message);
        }
    };

    return (
        <div
            style={{ maxWidth: "680px", margin: "0 auto" }}
            // id="scrollableDiv"
        >
            <CreatePostForm handlePostCreated={handlePostCreated} />
            {posts.length === 0 ? (
                <div style={{ padding: "20px 0" }}>
                    {[...Array(4)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={posts.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={
                        <div style={{ padding: "20px 0" }}>
                            <SkeletonCard />
                        </div>
                    }
                    endMessage={
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "200px",
                            }}
                        >
                            <div style={{ margin: "50px 0" }}>
                                <Typography.Text
                                    mark
                                    style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Bạn đã xem hết bài viết
                                </Typography.Text>
                            </div>

                            <Divider>
                                <Button
                                    onClick={() => window.location.reload()}
                                    style={{
                                        borderRadius: "8px",
                                    }}
                                >
                                    Làm mới trang
                                </Button>
                                <Button
                                    style={{ marginLeft: "20px" }}
                                    onClick={() =>
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        })
                                    }
                                >
                                    Về đầu trang
                                </Button>
                            </Divider>
                        </div>
                    }
                    scrollThreshold={1}
                    scrollableTarget="scrollableDiv"
                >
                    <PostList
                        posts={posts}
                        handleLike={handleLike}
                        handleCommentCountUpdate={handleCommentCountUpdate}
                        handleDeletePost={handleDeletePost}
                    />
                </InfiniteScroll>
            )}
        </div>
    );
};

export default HomePage;
