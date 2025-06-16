"use client";
import CommentCard from "./comment.card";
import { useState } from "react";
import ModalLoginRequire from "../modals/modal.loginrequire";

const ListComment = (props: any) => {
    const { comments, handleLikeComment, likeCommentLoading, setShowModal } =
        props;
    return (
        <>
            {comments.map((comment) => (
                <CommentCard
                    setShowModal={setShowModal}
                    key={comment.id}
                    comment={comment}
                    handleLikeComment={handleLikeComment}
                    likeCommentLoading={likeCommentLoading}
                />
            ))}
            {/* <ModalLoginRequire show={showModalLoginRequire} setShow={setShowModalLoginRequire}/> */}
        </>
    );
};
export default ListComment;
