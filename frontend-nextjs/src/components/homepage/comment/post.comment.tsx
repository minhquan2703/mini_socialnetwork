"use client";

import { getAllCommentOfOnePost } from "@/services/comment.service";
import CreateComment from "./create.comment";
import ListComment from "./list.comment";
import { useCallback, useEffect, useRef, useState } from "react";
import { postToggleLike } from "@/services/like.service";
import { HomePageProps } from "../homepage";
import { IComment } from "@/types/comment.type";

interface CommentPostProps extends HomePageProps {
    postId: string;
    showComment: boolean;
    commentCount: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LIMIT = 5;

const CommentPost = ({
    handleCommentCountUpdate,
    postId,
    showComment,
    commentCount,
    setShowModal,
}: CommentPostProps) => {
    const [current] = useState(1);
    const [comments, setComments] = useState<IComment[]>([]);
    const likeRequestCache = useRef(new Map());

    useEffect(() => {
        if (showComment) {
            fetchListComment();
        }
    }, [showComment]);

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
                                isLiked: res.data?.isLiked ?? !comment.isLiked,
                                likeCount: comment.isLiked
                                    ? comment.likeCount - 1
                                    : comment.likeCount + 1,
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

    const handleCommentCreated = useCallback((newComment: IComment) => {
        setComments((currentComments) => [newComment, ...currentComments]);
    }, []);
    const fetchListComment = async () => {
        const res = await getAllCommentOfOnePost({
            current: current,
            pageSize: LIMIT,
            postId: postId,
        });
        if (res?.data) {
            setComments(res.data?.results);
        }
    };
    return (
        <>
            <CreateComment
                postId={postId}
                handleCommentCreated={handleCommentCreated}
                handleCommentCountUpdate={handleCommentCountUpdate}
            />

            {commentCount > 0 ? (
                <ListComment
                    comments={comments}
                    handleLikeComment={handleLikeComment}
                    setShowModal={setShowModal}
                    setComments={setComments}
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
