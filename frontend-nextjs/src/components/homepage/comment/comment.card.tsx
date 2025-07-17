"use client";

import { CommentOutlined, MoreOutlined, StarFilled } from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import React, { useCallback, useState, useTransition } from "react";
import { useSession } from "@/library/session.context";
import ContainerChildComment from "./comment.child/container.child.comment";
import { IComment } from "@/types/comment.type";
import { ListCommentProps } from "./list.comment";

interface CommentCardProps extends ListCommentProps {
    comment: IComment;
}
const CommentCard = (props: CommentCardProps) => {
    const moreActions: MenuProps["items"] = [
        { key: "1", label: "Báo cáo", danger: true },
        { key: "2", label: "Theo dõi" },
    ];
    const { comment, handleLikeComment, setShowModal } = props;
    const [localCommentLikeCount, setCommentLocalLikeCount] = useState(
        comment.likeCount
    );
    const [localCommentIsLiked, setCommentLocalIsLiked] = useState(
        comment.isLiked
    );
    const [isShowChildComment, setIsShowChildComment] = useState(false);
    const [, startTransition] = useTransition();
    const session = useSession();
    const handleOptimisticLike = useCallback(() => {
        if (!session?.user) {
            setShowModal?.(true);
            return;
        }
        // Immediate UI update
        setCommentLocalIsLiked(!localCommentIsLiked);
        setCommentLocalLikeCount(
            localCommentIsLiked
                ? localCommentLikeCount - 1
                : localCommentLikeCount + 1
        );

        // API call in background with transition
        startTransition(() => {
            handleLikeComment?.(comment.id).catch(() => {
                //revert on error
                setCommentLocalIsLiked(localCommentIsLiked);
                setCommentLocalLikeCount(localCommentLikeCount);
            });
        });
    }, [session?.user, localCommentIsLiked, localCommentLikeCount, setShowModal, handleLikeComment, comment.id]);
    return (
        <>
            <div
                style={{
                    marginBottom: "12px",
                    display: "flex",
                    gap: "10px",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Gradient accent line */}
                <div
                    style={{
                        width: "2px",
                        background:
                            "linear-gradient(180deg, #e0e0e0 70%, transparent 100%)",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        padding: "12px 0",
                        width: "100%",
                    }}
                >
                    {/* Avatar với hover effect */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <Avatar
                            size={36}
                            src={comment?.user?.image}
                            style={{
                                backgroundColor: `${comment.user.avatarColor}`,
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "14px",
                                border: "2px solid #fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                            }}
                        >
                            {comment.user.name.charAt(0) ||
                                comment.user.username.charAt(0)}
                        </Avatar>
                        {/* Online indicator */}
                        {/* <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: "10px",
                                height: "10px",
                                background: "#52c41a",
                                borderRadius: "50%",
                                border: "2px solid #fff",
                            }}
                        /> */}
                    </div>

                    {/* Content area */}
                    <div style={{ flex: 1 }}>
                        {/* Header với background mềm mại */}
                        <div
                            style={{
                                background: "#f8f9fa",
                                borderRadius: "16px",
                                padding: "12px 16px",
                                position: "relative",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                transition: "all 0.2s ease",
                            }}
                            className="comment-content-wrapper"
                        >
                            {/* User info */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            color: "#1a1a1a",
                                            cursor: "pointer",
                                            transition: "color 0.2s ease",
                                        }}
                                        className="username-hover"
                                    >
                                        {comment.user.name ||
                                            comment.user.username}
                                    </span>
                                    {/* Verified badge (optional) */}
                                    {/* {comment?.user?.verified && (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="#1890ff"
                                        >
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    )} */}
                                </div>
                                <Dropdown
                                    menu={{ items: moreActions }}
                                    placement="bottomRight"
                                    trigger={["hover"]}
                                >
                                    <Button
                                        type="text"
                                        icon={<MoreOutlined />}
                                        style={{
                                            color: "#999",
                                            fontSize: "16px",
                                            padding: "4px",
                                            height: "auto",
                                            opacity: 0.7,
                                            transition: "opacity 0.2s ease",
                                        }}
                                        className="more-btn"
                                    />
                                </Dropdown>
                            </div>

                            {/* Comment content */}
                            <p
                                style={{
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    color: "#4a4a4a",
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}
                            >
                                {comment.content}
                            </p>
                        </div>

                        {/* Actions bar */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                marginTop: "8px",
                                paddingLeft: "16px",
                            }}
                        >
                            {/* Time */}
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#8c8c8c",
                                    fontWeight: "500",
                                }}
                            >
                                {comment.timeBefore}
                            </span>

                            {/*like button*/}
                            <div style={{ display: "flex", gap: "8px" }}>
                                <Button
                                    icon={<StarFilled />}
                                    onClick={handleOptimisticLike}
                                    style={{
                                        border: `1px solid ${
                                            localCommentIsLiked ? "red" : "gold"
                                        }`,
                                        backgroundColor: localCommentIsLiked
                                            ? "red"
                                            : "white",
                                        color: localCommentIsLiked
                                            ? "yellow"
                                            : "gold",
                                        fontSize: "13px",
                                        width: "35px",
                                        height: "22px",
                                        borderRadius: "2px",
                                        transition: "all 0.3s ease",
                                        transform: localCommentIsLiked
                                            ? "scale(1.05)"
                                            : "scale(1)",
                                    }}
                                ></Button>
                                <span
                                    style={{
                                        fontSize: "13px",
                                        color: localCommentIsLiked
                                            ? "#FFD700"
                                            : "#8c8c8c",
                                        fontWeight: localCommentIsLiked
                                            ? "600"
                                            : "500",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {localCommentLikeCount || 0}
                                </span>
                            </div>
                            {/* Reply button */}
                            <Button
                                variant="text"
                                color="default"
                                size="middle"
                                onClick={() =>
                                    setIsShowChildComment(!isShowChildComment)
                                }
                            >
                                <CommentOutlined />
                                <span>{comment.childCommentsCount}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {isShowChildComment && (
                <ContainerChildComment
                    isShowChildComment={isShowChildComment}
                    commentId={comment.id}
                />
            )}
        </>
    );
};
export default React.memo(CommentCard);
