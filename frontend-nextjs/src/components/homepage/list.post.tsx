import React from "react";
import PostCard from "./post.card";
import SkeletonCard from "./skeleton.card";


const PostList =({ posts, handleLike, loading, likeLoading }) => {
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
                <PostCard key={post.id} post={post} handleLike={handleLike} likeLoading={likeLoading} />
            ))}
        </>
    );
};

export default React.memo(PostList);
