"use client";
import React, { useState } from "react";
import PostCard from "./post.card";
import SkeletonCard from "./skeleton.card";
import ModalLoginRequire from "./modals/modal.loginrequire";

const PostList = ({
    handleCommentCountUpdate,
    posts,
    handleLike,
    loading,
    likeLoading,
    handleDeletePost,
}) => {
    const [showModal, setShowModal] = useState(false);

    if (loading) {
        // Render 4 skeleton cards khi loading
        return (
            <>
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </>
        );
    }
    return (
        <>
            {posts.map((post) => (
                <PostCard
                    handleCommentCountUpdate={handleCommentCountUpdate}
                    key={post.id}
                    post={post}
                    handleLike={handleLike}
                    likeLoading={likeLoading}
                    setShowModal={setShowModal}
                    handleDeletePost={handleDeletePost}

                />
            ))}
            <ModalLoginRequire showModal={showModal} setShowModal={setShowModal} />
        </>
    );
};

export default React.memo(PostList);
