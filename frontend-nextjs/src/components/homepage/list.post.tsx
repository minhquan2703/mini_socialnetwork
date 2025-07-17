"use client";
import React, { useState } from "react";
import PostCard from "./post.card";
import ModalLoginRequire from "./modals/modal.loginrequire";
import { IPost } from "@/types/post.type";
import { HomePageProps } from "./homepage";

interface PostListProps extends HomePageProps {
    posts: IPost[];
}

const PostList = ({
    handleCommentCountUpdate,
    posts,
    handleLike,
    handleDeletePost,
}: PostListProps) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    handleCommentCountUpdate={handleCommentCountUpdate}
                    key={post.id}
                    post={post}
                    handleLike={handleLike}
                    setShowModal={setShowModal}
                    handleDeletePost={handleDeletePost}
                />
            ))}
            <ModalLoginRequire
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </>
    );
};

export default React.memo(PostList);
