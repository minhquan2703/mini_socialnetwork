"use client";

import { getAllCommentOfOnePost } from "@/services/comment.service";
import CommentCard from "./comment.card";

const ListComment = (props: any) => {
    
    const {
        comments,
        handleLikeComment,
        loading,
        likeCommentLoading,
        postId,
        session,
    } = props;
    return (
        <>
            {comments.map((comment) => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    handleLikeComment={handleLikeComment}
                    likeCommentLoading={likeCommentLoading}
                    session={session}
                />
            ))}
        </>
    );
};
export default ListComment;
