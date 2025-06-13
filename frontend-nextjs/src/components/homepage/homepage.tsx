"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "antd";
import { getAllPosts } from "@/services/post.service";
import { postToggleLike } from "@/services/like.service";
import CreatePostForm from "./create.post";
import PostList from "./list.post";

const LIMIT = 7;

const HomePage = (props: any) => {
    const { session } = props;
    const [current, setCurrent] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
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
            console.log("check res getAllPost", res);
            setPosts(res.data.results);
            setMaxPage(res.data.totalPages);
            setLoading(false);
        }
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
                return res;
            } catch (error) {
                console.error("Like error:", error);
                throw error;
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

    const handlePostCreated = useCallback((newPost: string) => {
        setPosts((currentPosts) => [newPost, ...currentPosts]);
    }, []);
        console.log('check post', posts)

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <CreatePostForm
                session={session}
                onPostCreated={handlePostCreated}
            />

            <PostList
                session={session}
                posts={posts}
                handleLike={handleLike}
                loading={loading}
                likeLoading={likeLoading}
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
