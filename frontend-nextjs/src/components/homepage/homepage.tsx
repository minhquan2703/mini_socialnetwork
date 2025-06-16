"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "antd";
import { deleteOnePost, getAllPosts } from "@/services/post.service";
import { postToggleLike } from "@/services/like.service";

import { toast } from "sonner";
import CreatePostForm from "./create.post";
import PostList from "./list.post";


// interface HomePageClientProps {
//     initialPosts: any[];
//     initialMaxPage: number;
// }

const LIMIT = 7; //số lượng bài viết mỗi trang

const HomePage = () => {
    const [current, setCurrent] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState({});
    const [maxPage, setMaxPage] = useState(10);

    const likeRequestCache = useRef(new Map());

    useEffect(() => {
        getDataPosts();
    }, [current]);

    const getDataPosts = async () => {
        setLoading(true);
        const res = await getAllPosts({ current, pageSize: LIMIT });
        if (res && res?.data) {
            setPosts(res.data.results);
            setMaxPage(res.data.totalPages);
        }
        setLoading(false);
    };

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
                                isLiked: res.data.isLiked ?? !post.isLiked,
                                likeCount:
                                    res.data.likeCount ??
                                    (post.isLiked
                                        ? post.likeCount - 1
                                        : post.likeCount + 1),
                            };
                        })
                    );
                }
                else {
                    toast.error(res.message)
                }
                return res;
            } catch (error) {
                throw error
            } finally {
                //clear cache timout 500ms
                setTimeout(() => {
                    likeRequestCache.current.delete(postId);
                }, 500);
            }
        })();

        likeRequestCache.current.set(postId, likePromise);
        return likePromise;
    }, []);

    const handlePostCreated = useCallback((newPost: any) => {
        setPosts((currentPosts) => [newPost, ...currentPosts]);
    }, []);

    const handleCommentCountUpdate = (postId: string, increment: number) => {
    console.log('Before update:', posts.find(p => p.id === postId)?.commentCount);
    setPosts((currentPosts) =>
        currentPosts.map((post) => {
            if (post.id !== postId) return post;
            return {
                ...post,
                commentCount: Math.max(0, (post.commentCount || 0) + increment),
            };
        })
    );
    }
    const handleDeletePost = async(postIdDeleted: string) =>{
        const res = await deleteOnePost(postIdDeleted);
        console.log('check res delete', res)
        if (res && res?.data){
            setPosts((currentPost) => currentPost.filter((post) => post.id !== postIdDeleted))
            toast.success('Xoá bài viết thành công');
        }
        if (res && res?.error){
            toast.error(res.message);
        }
    }
    return (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <CreatePostForm
                handlePostCreated={handlePostCreated}
            />

            <PostList
                posts={posts}
                handleLike={handleLike}
                loading={loading}
                likeLoading={likeLoading}
                handleCommentCountUpdate={handleCommentCountUpdate}
                handleDeletePost={handleDeletePost}
            />

            <div style={{ textAlign: "center", padding: "24px 0 48px" }}>
                {+current === +maxPage ? (
                    <>
                        <span style={{ fontWeight: "600", fontSize: "20px" }}>
                            ~ Hết ~
                        </span>
                        <div>
                            <Button
                                type="default"
                                style={{
                                    borderRadius: "8px",
                                    marginTop: "15px",
                                    height: "40px",
                                    paddingLeft: "32px",
                                    paddingRight: "32px",
                                    fontWeight: "500",
                                }}
                                onClick={() => setCurrent(current - 1)}
                            >
                                Quay lại
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Button
                            type="default"
                            style={{
                                borderRadius: "8px",
                                height: "40px",
                                paddingLeft: "32px",
                                paddingRight: "32px",
                                fontWeight: "500",
                            }}
                            onClick={() => setCurrent(current + 1)}
                        >
                            Xem thêm
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;