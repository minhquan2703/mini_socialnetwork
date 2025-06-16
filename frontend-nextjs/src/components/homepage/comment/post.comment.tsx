"use client";

import { getAllCommentOfOnePost } from "@/services/comment.service";
import CreateComment from "./create.comment";
import ListComment from "./list.comment";
import { useCallback, useEffect, useRef, useState } from "react";
import { postToggleLike } from "@/services/like.service";
import { useSession } from "@/library/session.context";

const LIMIT = 5;

const CommentPost = ({ handleCommentCountUpdate, postId, showComment, commentCount, setShowModal }) => {
    const [current, setCurrent] = useState(1);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);    
    const [likeCommentLoading, setCommentLikeLoading] = useState({});    
    const session= useSession();
    const likeRequestCache = useRef(new Map());


    useEffect(() => {
        if(showComment){
            fetchListComment()
        }
    }, [current, showComment]);

    const handleLikeComment = useCallback(async (commentId: string) => {
        if (likeRequestCache.current.has(commentId)) {
            return likeRequestCache.current.get(commentId);
        }
        const likePromise = (async () => {
            try {
                const res = await postToggleLike({
                    type: "comment",
                    commentId: commentId,
                });
                if (res && res.data) {
                    //update global state sau khi response
                    setComments((currentComments) =>
                        currentComments.map((comment) => {
                            if (comment.id !== commentId) return comment;
                            return {
                                ...comment,
                                isLiked: res.data.isLiked ?? !comment.isLiked,
                                likeCount:
                                    res.data.likeCount ??
                                    (comment.isLiked
                                        ? comment.likeCount - 1
                                        : comment.likeCount + 1),
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
                    likeRequestCache.current.delete(commentId);
                }, 500);
            }
        })();

        likeRequestCache.current.set(commentId, likePromise);
        return likePromise;
    }, []);

    const handleCommentCreated = useCallback((newComment: any) => {
        setComments((currentComments) => [newComment, ...currentComments]);
    }, []);
    const fetchListComment = async () => {
        setLoading(true);
        const res = await getAllCommentOfOnePost({
            current: current,
            pageSize: LIMIT,
            postId: postId,
        });
        if (res?.data) {
            setComments(res.data.results);
        }
        setLoading(false)
    };
    if (!showComment) return null
    return (
        <>

            <CreateComment
                postId={postId}
                handleCommentCreated={handleCommentCreated}
                handleCommentCountUpdate={handleCommentCountUpdate}
            />

            {commentCount > 0 ? (
                <ListComment
                    postId={postId}
                    comments={comments}
                    handleLikeComment={handleLikeComment}
                    loading={loading}
                    likeCommentLoading={likeCommentLoading}
                    setShowModal={setShowModal}
                />
            ) : (
                <div
                    style={{
                        marginTop: "20px",
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "gray",
                    }}
                >
                    Không có bình luận
                </div>
            )}
        </>
    );
};
export default CommentPost;