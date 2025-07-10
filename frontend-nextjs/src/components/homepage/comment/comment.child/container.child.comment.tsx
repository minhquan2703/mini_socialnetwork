"use client"
import { toast } from "sonner";
import CreateChildComment from "./create.child.comment";
import ListChildComment from "./list.child.comment";
import { useCallback, useEffect, useRef, useState } from "react";
import { IChildComment } from "@/types/comment.type";
import { getChildComment } from "@/services/comment.service";
import { postToggleLike } from "@/services/like.service";

interface ContainerChildCommentProps {
    commentId: string;
    isShowChildComment: boolean;
}
const ContainerChildComment = ({
    commentId,
    isShowChildComment,
}: ContainerChildCommentProps) => {
    const [current, setCurrent] = useState(1);
    const [dataChildComments, setDataChildComments] = useState<IChildComment[]>(
        []
    );
    const likeRequestCache = useRef(new Map());

    const LIMIT = 5;
    useEffect(() => {
        fetchListChildComments();
    }, [isShowChildComment, current]);
    const fetchListChildComments = async () => {
        const res = await getChildComment({
            current: current,
            pageSize: LIMIT,
            commentId: commentId,
        });
        if (res.data) {
            setDataChildComments(res.data.result);
        } else {
            toast.error("Đã có lỗi xảy ra");
        }
    };
    const handleLikeChildComment = useCallback(
        async (childCommentId: string) => {
            if (likeRequestCache.current.has(childCommentId)) {
                return likeRequestCache.current.get(childCommentId);
            }
            const likePromise = (async () => {
                try {
                    const res = await postToggleLike({
                        type: "child-comment",
                        childCommentId: childCommentId,
                    });
                    if (res && res.data) {
                        //update global state sau khi response
                        setDataChildComments((currentData) =>
                            currentData.map((childComment) => {
                                if (childComment.id !== childCommentId)
                                    return childComment;
                                return {
                                    ...childComment,
                                    isLiked:
                                        res.data?.isLiked ??
                                        !childComment.isLiked,
                                    likeCount: childComment.isLiked
                                        ? childComment.likeCount - 1
                                        : childComment.likeCount + 1,
                                };
                            })
                        );
                    }
                } catch (error) {
                    console.error("Like error:", error);
                    throw error;
                } finally {
                    //clear cache timout 500ms
                    setTimeout(() => {
                        likeRequestCache.current.delete(childCommentId);
                    }, 500);
                }
            })();

            likeRequestCache.current.set(childCommentId, likePromise);
            return likePromise;
        },
        []
    );
    return (
        <>
            <CreateChildComment
                commentId={commentId}
                dataChildComments={dataChildComments}
                setDataChildComments={setDataChildComments}
            />
            <ListChildComment
                dataChildComments={dataChildComments}
                handleLikeChildComment={handleLikeChildComment}
            />
        </>
    );
};
export default ContainerChildComment;
