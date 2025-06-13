"use client";

import {
    HeartFilled,
    HeartOutlined,
    MoreOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, MenuProps } from "antd";
import React, {
    startTransition,
    useCallback,
    useState,
    useTransition,
} from "react";
import ModalLoginRequire from "../modals/modal.loginrequire";

const CommentCard = (props) => {
    const moreActions: MenuProps["items"] = [
        { key: "1", label: "Báo cáo", danger: true },
        { key: "2", label: "Theo dõi" },
    ];
    const { comment, handleLikeComment, likeCommentLoading, session } = props;
    const [localCommentLikeCount, setCommentLocalLikeCount] = useState(
        comment.likeCount
    );
    const [localCommentIsLiked, setCommentLocalIsLiked] = useState(
        comment.isLiked
    );
    const [isPending, startTransition] = useTransition();

    const [showModalLoginRequire, setShowModalLoginRequire] = useState(false);
    const handleOptimisticLike = useCallback(() => {
        if (!session?.user) {
            setShowModalLoginRequire(true);
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
            handleLikeComment(comment.id).catch(() => {
                // Revert on error
                setCommentLocalIsLiked(localCommentIsLiked);
                setCommentLocalLikeCount(localCommentLikeCount);
            });
        });
    }, [
        localCommentIsLiked,
        localCommentLikeCount,
        comment.id,
        handleLikeComment,
    ]);
    return (
        <>
            <div
                style={{
                    marginBottom: "12px",
                    position: "relative",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Gradient accent line */}
                <div
                    style={{
                        position: "absolute",
                        left: "40px",
                        top: "0",
                        bottom: "0",
                        width: "2px",
                        background: "linear-gradient(180deg, #e0e0e0 0%, transparent 100%)",
                        opacity: 0.6,
                    }}
                />
                
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        padding: "12px 0",
                        position: "relative",
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
                            className="comment-avatar"
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
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                                        {comment.user.name || comment.user.username}
                                    </span>
                                    {/* Verified badge (optional) */}
                                    {comment.user.verified && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1890ff">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    )}
                                </div>
                                <Dropdown
                                    menu={{ items: moreActions }}
                                    placement="bottomRight"
                                    trigger={['hover']}
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

                            {/* Like button với animation */}
                            <button
                                onClick={handleOptimisticLike}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    transition: "all 0.2s ease",
                                    transform: localCommentIsLiked ? "scale(1.05)" : "scale(1)",
                                }}
                                className="like-button-wrapper"
                            >
                                <StarFilled 
                                    style={{ 
                                        color: localCommentIsLiked ? "#FFD700" : "#d4d4d4",
                                        fontSize: "16px",
                                        filter: localCommentIsLiked ? "drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))" : "none",
                                        transition: "all 0.3s ease",
                                    }} 
                                />
                                <span
                                    style={{
                                        fontSize: "13px",
                                        color: localCommentIsLiked ? "#FFD700" : "#8c8c8c",
                                        fontWeight: localCommentIsLiked ? "600" : "500",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {localCommentLikeCount || 0}
                                </span>
                            </button>

                            {/* Reply button */}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    color: "#8c8c8c",
                                    fontWeight: "600",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    transition: "all 0.2s ease",
                                }}
                                className="reply-button"
                            >
                                Trả lời
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom styles */}
            <style jsx>{`
                .comment-avatar:hover {
                    transform: scale(1.1);
                }
                
                .comment-content-wrapper:hover {
                    background: #f0f2f5 !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
                }
                
                .username-hover:hover {
                    color: #1890ff !important;
                    text-decoration: underline;
                }
                
                .more-btn:hover {
                    opacity: 1 !important;
                    background: rgba(0,0,0,0.04) !important;
                }
                
                .like-button-wrapper:hover {
                    background: rgba(255, 215, 0, 0.1) !important;
                }
                
                .like-button-wrapper:active {
                    transform: scale(0.95) !important;
                }
                
                .reply-button:hover {
                    background: rgba(0,0,0,0.04) !important;
                    color: #1890ff !important;
                }
                
                @keyframes likeAnimation {
                    0% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.3) rotate(-10deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                
                .like-button-wrapper:active .anticon {
                    animation: likeAnimation 0.4s ease;
                }
            `}</style>
            
            <ModalLoginRequire
                show={showModalLoginRequire}
                setShow={setShowModalLoginRequire}
            />
        </>
    );
};
export default React.memo(CommentCard);