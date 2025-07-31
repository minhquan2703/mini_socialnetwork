"use client";
import React from "react";
import CommentCard from "./comment.card";
import { IComment } from "@/types/comment.type";
import { ToggleLikeResponse } from "@/types/like.type";

export interface ListCommentProps {
    handleLikeComment?: (commendId: string) => Promise<ToggleLikeResponse>;
    comments?: IComment[];
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}

const ListComment = (props: ListCommentProps) => {
    const { comments, setComments, handleLikeComment, setShowModal } = props;

    const handleDeleteComment = async (id: string) => {
            if (setComments) {
                setComments((currentComment) =>
                    currentComment.filter((comment) => comment.id !== id)
                );
            }
        }
    return (
        <>
            {comments?.map((comment) => (
                <CommentCard
                    setShowModal={setShowModal}
                    key={comment.id}
                    comment={comment}
                    handleLikeComment={handleLikeComment}
                    handleDeleteComment={handleDeleteComment}
                />
            ))}
        </>
    );
};
export default React.memo(ListComment);
