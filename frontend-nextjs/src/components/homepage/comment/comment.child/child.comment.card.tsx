"use client";

import { HeartFilled, HeartOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import React, { useCallback, useState, useTransition } from "react";
import { useSession } from "@/library/session.context";
import { IChildComment } from "@/types/comment.type";
import { AxiosResponse } from "axios";
import { ToggleLikeResponse } from "@/types/like.type";
import TextArea from "antd/es/input/TextArea";
import ModalUpdateComment from "../../modals/modal.update.comment";
import ModalDeleteComment from "../../modals/modal.delete.comment";
import ModalReport from "../../modals/modal.report";
import ModalLoginRequire from "../../modals/modal.loginrequire";

interface ChildCommentCardProps {
    childComment: IChildComment;
    handleLike: (
        childCommentId: string
    ) => Promise<AxiosResponse<ToggleLikeResponse>>;
    handleDeleteChildComment: (id: string) => void;
}
const ChildCommentCard = ({
    childComment,
    handleLike,
    handleDeleteChildComment,
}: ChildCommentCardProps) => {
    const [localLikeCount, setLocalLikeCount] = useState<number>(
        childComment.likeCount
    );
    const [localIsLiked, setLocalIsLiked] = useState<boolean>(
        childComment.isLiked
    );
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [contentUpdate, setContentUpdate] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [isShowModalDelete, setIsShowModalDelete] = useState<boolean>(false);
    const [isShowModalUpdate, setIsShowModalUpdate] = useState<boolean>(false);
    const [isShowReportModal, setIsShowReportModal] = useState<boolean>(false);
    const [isShowModalLoginRequire, setIsShowModalLoginRequire] = useState<boolean>(false);
    const [content, setContent] = useState<string>(childComment.content);
    const session = useSession();
    const handleOptimisticLike = useCallback(() => {
        if (!session?.user) {
            setIsShowModalLoginRequire(true);
            return;
        }
        // Immediate UI update
        setLocalIsLiked(!localIsLiked);
        setLocalLikeCount(
            localIsLiked ? localLikeCount - 1 : localLikeCount + 1
        );

        startTransition(() => {
            handleLike(childComment.id).catch(() => {
                // Revert on error
                setLocalIsLiked(localIsLiked);
                setLocalLikeCount(localLikeCount);
            });
        });
    }, [localIsLiked, setLocalLikeCount, childComment.id, handleLike]);
    const moreActions: MenuProps["items"] = [
        { key: "1", label: "Báo cáo", danger: true, onClick: () => setIsShowReportModal(true) },
        // { key: "2", label: "Theo dõi" },
    ];
    const authorActions: MenuProps["items"] = [
        { key: "update", label: "Sửa", onClick: () => handleUpdate() },
        {
            key: "delete",
            label: "Xoá bình luận",
            danger: true,
            onClick: () => setIsShowModalDelete(true),
        },
    ];
    const handleUpdate = () => {
        setIsUpdating(true);
        setContentUpdate(childComment.content);
    };
    const handleCancelUpdate = () => {
        setIsUpdating(false);
        setContentUpdate("");
    };
    return (
        <>
            <div
                style={{
                    marginBottom: "5px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    gap: "10px",
                    marginLeft: "50px",
                }}
            >
                <div
                    style={{
                        width: "2px",
                        background:
                            "linear-gradient(180deg, #e0e0e0 60%, transparent 100%)",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        width: "100%",
                    }}
                >
                    {/* Avatar với hover effect */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <Avatar
                            size={36}
                            src={childComment?.user?.image}
                            style={{
                                backgroundColor: `${childComment.user.avatarColor}`,
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "14px",
                                border: "2px solid #fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                            }}
                        >
                            {childComment.user.name.charAt(0) ||
                                childComment.user.username.charAt(0)}
                        </Avatar>
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
                                    {childComment.user.name ||
                                        childComment.user.username}
                                </span>
                                <Dropdown
                                    menu={{
                                        items: childComment?.isAuthor
                                            ? authorActions
                                            : moreActions,
                                    }}
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
                                    />
                                </Dropdown>
                            </div>

                            {/* content */}
                            {isUpdating ? (
                                <>
                                    <TextArea
                                        value={contentUpdate}
                                        onChange={(e) =>
                                            setContentUpdate(e.target.value)
                                        }
                                    />
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <Button
                                            onClick={() => handleCancelUpdate()}
                                        >
                                            Huỷ chỉnh sửa
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="solid"
                                            onClick={() =>
                                                setIsShowModalUpdate(true)
                                            }
                                        >
                                            Sửa
                                        </Button>
                                    </div>
                                </>
                            ) : (
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
                                    {content}
                                </p>
                            )}
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
                                {childComment.timeBefore}
                            </span>

                            {/*like button*/}
                            <div style={{ display: "flex", gap: "5px" }}>
                                <Button
                                    icon={
                                        localIsLiked ? (
                                            <HeartFilled />
                                        ) : (
                                            <HeartOutlined />
                                        )
                                    }
                                    onClick={handleOptimisticLike}
                                    color="danger"
                                    style={{
                                        border: "none",
                                        fontSize: "15px",
                                        padding: "10px",
                                        height: "22px",
                                        transition: "all 0.3s ease",
                                        transform: localIsLiked
                                            ? "scale(1.05)"
                                            : "scale(1)",
                                    }}
                                    variant={
                                        localIsLiked ? "filled" : "outlined"
                                    }
                                ></Button>
                                <span
                                    style={{
                                        fontSize: "13px",
                                        color: "#8c8c8c",
                                    }}
                                >
                                    {localLikeCount || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isShowModalUpdate && (
                <ModalUpdateComment
                    type="CHILDCOMMENT"
                    id={childComment.id}
                    updatedContent={contentUpdate}
                    isShowModalUpdate={isShowModalUpdate}
                    setIsShowModalUpdate={setIsShowModalUpdate}
                    setContent={setContent}
                    setIsUpdating={setIsUpdating}
                />
            )}
            {isShowModalDelete && (
                <ModalDeleteComment
                    type="CHILDCOMMENT"
                    id={childComment.id}
                    content={childComment.content}
                    isShow={isShowModalDelete}
                    setIsShow={setIsShowModalDelete}
                    handleDeleteComment={handleDeleteChildComment}
                />
            )}
            {isShowReportModal && (
                <ModalReport
                    type="CHILDCOMMENT"
                    id={childComment.id}
                    isShow={isShowReportModal}
                    setIsShow={setIsShowReportModal}
                />
            )}
            {isShowModalLoginRequire && (
            <ModalLoginRequire
                showModal={isShowModalLoginRequire}
                setShowModal={setIsShowModalLoginRequire}
            />
            )}
        </>
    );
};
export default React.memo(ChildCommentCard);
