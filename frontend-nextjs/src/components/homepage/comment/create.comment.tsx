"use client";

import { useSession } from "@/library/session.context";
import { postComment } from "@/services/comment.service";
import { Button, Card, Space, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { toast } from "sonner";

const CreateComment = (props: any) => {
    const { postId, handleCommentCreated, handleCommentCountUpdate } = props;
    const [uploading, setUploading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const session = useSession();

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const res = await postComment({
                content: newComment,
                postId: postId,
            });

            if (res?.data) {
                setNewComment("");
                handleCommentCreated(res.data);
                if (handleCommentCountUpdate) {
                    handleCommentCountUpdate(postId, 1);
                }
            }
            if (res.statusCode === 429) {
                toast.error(
                    "Bạn đang đăng bình luận quá nhanh, vui lòng đợi cho lần tiếp theo"
                );
            }
            if (res?.error) {
                toast.error(res.message);
            }
        } catch {
            toast.error("Có lỗi xảy ra khi bình luận");
        } finally {
            setUploading(false);
        }
    };

    if (!session?.user) return null;

    return (
        <>
            <div
                style={{
                    height: "auto",
                    marginTop: "20px",
                }}
            >
                <Card
                    style={{
                        marginBottom: "24px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        boxShadow: "none",
                    }}
                    styles={{ body: { padding: "10px" } }}
                >
                    <Spin spinning={uploading} tip="Đang đăng bình luận...">
                        <div style={{ display: "flex", gap: "100px" }}>
                            <div style={{ flex: 1 }}>
                                <TextArea
                                    placeholder="Bình luận bài viết?"
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    autoSize={{ minRows: 1, maxRows: 2 }}
                                    maxLength={450}
                                    variant="borderless"
                                    style={{
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        padding: "5px 65px 5px 5px",
                                        resize: "none",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        fontSize: "12px",
                                        color: "#444",
                                        background: "white",
                                    }}
                                >
                                    {newComment.length}/450
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        marginTop: "10px",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    {/* <Space size={20}>
                                        <Button
                                            type="text"
                                            icon={<SmileOutlined />}
                                            style={{ color: "#666" }}
                                        ></Button>
                                    </Space> */}
                                    <Button
                                        color="default"
                                        variant="solid"
                                        style={{
                                            fontWeight: "600"
                                        }}
                                        disabled={!newComment.trim()}
                                        onClick={handleSubmit}
                                        loading={uploading}
                                    >
                                        Đăng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Spin>
                </Card>{" "}
            </div>
        </>
    );
};
export default CreateComment;
