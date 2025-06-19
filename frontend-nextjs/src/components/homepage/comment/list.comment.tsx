"use client";
import React from "react";
import CommentCard from "./comment.card";

const ListComment = (props: any) => {
    const { comments, handleLikeComment, setShowModal } =
        props;
    return (
        <>
            {comments.map((comment) => (
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
