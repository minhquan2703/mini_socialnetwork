"use client";
import { IChildComment } from "@/types/comment.type";
import React from "react";
import ChildCommentCard from "./child.comment.card";
import { AxiosResponse } from "axios";
import { ToggleLikeResponse } from "@/types/like.type";

export interface ListChildCommentProps {
    dataChildComments: IChildComment[];
    handleLikeChildComment: (
        childCommentId: string
    ) => Promise<AxiosResponse<ToggleLikeResponse>>;
    setDataChildComments:  React.Dispatch<React.SetStateAction<IChildComment[]>>;
}

const ListChildComment = ({
    dataChildComments,
    handleLikeChildComment,
    setDataChildComments,
}: ListChildCommentProps) => {
    const handleDeleteChildComment = async (id: string) => {
        if (dataChildComments) {
            setDataChildComments((current) =>
                current.filter((childComment) => childComment.id !== id)
            );
        }
    };

    return (
        <>
            {dataChildComments.length > 0 ? (
                dataChildComments.map((childComment) => (
                    <ChildCommentCard
                        handleLike={handleLikeChildComment}
                        key={childComment.id}
                        childComment={childComment}
                        handleDeleteChildComment={handleDeleteChildComment}
                    />
                ))
            ) : (
                <></>
            )}
        </>
    );
};
export default React.memo(ListChildComment);
