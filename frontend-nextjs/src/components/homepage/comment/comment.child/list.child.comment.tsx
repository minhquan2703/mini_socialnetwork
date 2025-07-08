"use client";
import { IChildComment } from "@/types/comment.type";
import React from "react";
import ChildCommentCard from "./child.comment.card";
import { AxiosResponse } from "axios";
import { ToggleLikeResponse } from "@/types/like.type";

export interface ListChildCommentProps {
    dataChildComments: IChildComment[];
    handleLikeChildComment: (childCommentId: string) => Promise<AxiosResponse<ToggleLikeResponse>>;
}

const ListChildComment = ({ dataChildComments, handleLikeChildComment }: ListChildCommentProps) => {

    return (
        <>
            {dataChildComments.length > 0 ? (
                dataChildComments.map((childComment) => (
                    <ChildCommentCard
                        handleLike={handleLikeChildComment}
                        key={childComment.id}
                        childComment={childComment}
                    />
                ))
            ) : (
                <></>
            )}
        </>
    );
};
export default React.memo(ListChildComment);
