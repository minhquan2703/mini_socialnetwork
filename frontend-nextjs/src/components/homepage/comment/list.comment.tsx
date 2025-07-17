"use client";
import React from "react";
import CommentCard from "./comment.card";
import { IComment } from "@/types/comment.type";
import { ToggleLikeResponse } from "@/types/like.type";

export interface ListCommentProps{
    handleLikeComment?: (commendId: string) => Promise<ToggleLikeResponse>;
    comments?: IComment[];
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
}

const ListComment = (props: ListCommentProps) => {
    const { comments, handleLikeComment, setShowModal } =
        props;
    return (
        <>
            {comments?.map((comment) => (
                <CommentCard
                    setShowModal={setShowModal}
                    key={comment.id}
                    comment={comment}
                    handleLikeComment={handleLikeComment}
                />
            ))}
        </>
    );
};
export default React.memo(ListComment);
