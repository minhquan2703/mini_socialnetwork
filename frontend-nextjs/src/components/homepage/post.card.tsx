import { Card, Avatar, Button, Divider, Dropdown, Space, Image } from "antd";
import {
    CommentOutlined,
    ShareAltOutlined,
    MoreOutlined,
    HeartFilled,
    HeartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import React, { useState, useCallback, useTransition } from "react";
import ModalLoginRequire from "./modals/modal.loginrequire";
import { toast } from "sonner";
import CommentPost from "./comment/post.comment";

const PostCard = ({ session, post, handleLike, likeLoading }) => {
    const moreActions: MenuProps["items"] = [
        { key: "1", label: "Lưu bài viết" },
        { key: "2", label: "Sao chép liên kết" },
        { type: "divider" },
        { key: "3", label: "Báo cáo", danger: true },
    ];
    const [showModalLoginRequire, setShowModalLoginRequire] = useState(false);
    // Local state for optimistic UI
    const [localIsLiked, setLocalIsLiked] = useState(post.isLiked);
    const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
    const [isPending, startTransition] = useTransition();
    const [showComment, setShowComment] = useState(false);

    const handleComment = () => {
        if (!session?.user) {
            setShowModalLoginRequire(true);
            return;
        }
        toast.warning("Tính năng đang phát triển, vui lòng đợi");
    };
    const handleShare = () => {
        if (!session?.user) {
            setShowModalLoginRequire(true);
            return;
        }
        toast.warning("Tính năng đang phát triển, vui lòng đợi");
    };
    // Optimistic update handler
    const handleOptimisticLike = useCallback(() => {
        if (!session?.user) {
            setShowModalLoginRequire(true);
            return;
        }
        // Immediate UI update
        setLocalIsLiked(!localIsLiked);
        setLocalLikeCount(
            localIsLiked ? localLikeCount - 1 : localLikeCount + 1
        );

        // API call in background with transition
        startTransition(() => {
            handleLike(post.id).catch(() => {
                // Revert on error
                setLocalIsLiked(localIsLiked);
                setLocalLikeCount(localLikeCount);
            });
        });
    }, [localIsLiked, localLikeCount, post.id, handleLike]);

    return (
        <>
            <Card
                style={{
                    marginBottom: "16px",
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "none",
                    width: "100%",
                }}
                styles={{
                    body: { padding: "20px" },
                }}
            >
                {/* Post Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                    }}
                >
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Avatar
                            size={42}
                            src={post?.user?.image}
                            style={{
                                backgroundColor: `${post.user.avatarColor}`,
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "18px",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            {post.user.name.charAt(0) ||
                                post.user.username.charAt(0)}
                        </Avatar>
                        <div>
                            <div
                                style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#000",
                                    lineHeight: "20px",
                                }}
                            >
                                {post.user.name || post.user.username}
                            </div>
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: "#666",
                                    lineHeight: "18px",
                                }}
                            >
                                @{post.user.username}
                            </div>
                        </div>
                    </div>
                    <Dropdown
                        menu={{ items: moreActions }}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            style={{ color: "#666", fontSize: "18px" }}
                        />
                    </Dropdown>
                </div>

                {/* Post Content */}
                <p
                    style={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#000",
                        marginBottom: "16px",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {post.content}
                </p>

                {/* Post Image */}
                {post.mediaType === "image" &&
                    post.photos &&
                    post.photos.length > 0 && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    post.photos.length === 1
                                        ? "1fr"
                                        : post.photos.length === 2
                                        ? "1fr 1fr"
                                        : post.photos.length <= 4
                                        ? "1fr 1fr"
                                        : "1fr 1fr 1fr",
                                gap: "8px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#f8f8f8",
                            }}
                        >
                            <Image.PreviewGroup>
                                {post.photos.map((photo) => (
                                    <Image
                                        key={photo.id}
                                        src={photo.url}
                                        alt="Post"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            maxHeight: "700px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                        preview={{
                                            mask: "xem ảnh",
                                        }}
                                    />
                                ))}
                            </Image.PreviewGroup>
                        </div>
                    )}
                {post.mediaType === "video" && post.mediaURL && (
                    <div
                        style={{
                            marginBottom: "16px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#000",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <video
                            src={post.mediaURL}
                            controls
                            style={{
                                width: "100%",
                                maxHeight: "460px",
                                borderRadius: "8px",
                                background: "#000",
                            }}
                        />
                    </div>
                )}
                <Divider style={{ margin: "12px 0" }} />

                {/* Post Stats */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        fontSize: "13px",
                        color: "#666",
                    }}
                >
                    <span>{post.commentCount || 0} bình luận</span>
                    <span>
                        {post.timeBefore} - {post.createdAt}
                    </span>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* Post Actions */}
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                >
                    <Button
                        className="like-btn"
                        color={localIsLiked ? "danger" : "default"}
                        variant={localIsLiked ? "text" : "outlined"}
                        icon={
                            localIsLiked ? <HeartFilled /> : <HeartOutlined />
                        }
                        onClick={handleOptimisticLike}
                        style={{
                            fontWeight: localIsLiked ? 600 : 400,
                            borderRadius: 8,
                            padding: "4px 12px",
                            height: 36,
                            transition:
                                "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: localIsLiked
                                ? "1px solid #ff4d4f"
                                : "1px solid #d9d9d9",
                            color: localIsLiked ? "#ff4d4f" : "#222",
                        }}
                    >
                        {localLikeCount}
                    </Button>
                    <style jsx>{`
                        .like-btn:hover {
                            border-color: #ff4d4f !important;
                            color: #ff4d4f !important;
                            background: #fff0f0 !important;
                        }
                    `}</style>
                    <Button
                        type="text"
                        icon={<CommentOutlined />}
                        style={{
                            color: "#666",
                            padding: "4px 12px",
                            height: "36px",
                            borderRadius: "8px",
                        }}
                        onClick={() => setShowComment(!showComment)}
                    >
                        Bình luận
                    </Button>
                    <Button
                        type="text"
                        icon={<ShareAltOutlined />}
                        style={{
                            color: "#666",
                            padding: "4px 12px",
                            height: "36px",
                            borderRadius: "8px",
                        }}
                        onClick={() => handleShare()}
                    >
                        Chia sẻ
                    </Button>
                </div>
                <CommentPost
                    showComment={showComment}
                    commentCount={post.commentCount}
                    session={session}
                    postId = {post.id}
                />
            </Card>
            <ModalLoginRequire
                showModal={showModalLoginRequire}
                setShowModal={setShowModalLoginRequire}
            />
        </>
    );
};

export default React.memo(PostCard);
