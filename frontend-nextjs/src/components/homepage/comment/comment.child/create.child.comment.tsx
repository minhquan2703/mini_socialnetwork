"use client";

import { useSession } from "@/library/session.context";
import { postChildComment } from "@/services/comment.service";
import { IChildComment } from "@/types/comment.type";
import { SendOutlined,  } from "@ant-design/icons";
import { Button, Card, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { toast } from "sonner";

interface CreateChildCommentProps {
    commentId: string,
    setDataChildComments: React.Dispatch<React.SetStateAction<IChildComment[]>>,
    dataChildComments: IChildComment[],
}
const CreateChildComment = ({commentId, setDataChildComments}: CreateChildCommentProps) => {
    const [uploading, setUploading] = useState(false);
    const [content, setContent] = useState("");
    const session = useSession();

    const handleCreateChildComment = async() => {
        const res = await postChildComment({content: content, commentId: commentId})
        if (res && res.data){
            handleChildCommentsUpdate(res.data)
        }
        else{
            toast.error(res.message)
        }
    };
    const handleChildCommentsUpdate = (newChildComment: IChildComment) =>{
        setDataChildComments((currentData) => [newChildComment, ...currentData]);
    }

    if (!session?.user) return null;

    return (
        <>
            <div
                style={{
                    height: "auto",
                    marginLeft: "50px",
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
                        <div style={{ display: "flex", gap: "10px" }}>
                                <TextArea
                                    placeholder="Bình luận bài viết?"
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    autoSize={{ minRows: 1, maxRows: 2 }}
                                    maxLength={450}
                                    variant="borderless"
                                    style={{
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        padding: "0 10px",
                                        resize: "none",
                                    }}
                                />
                                <Button
                                    color="default"
                                    variant="solid"
                                    style={{
                                        fontWeight: "600",
                                    }}
                                    disabled={!content.trim()}
                                    onClick={handleCreateChildComment}
                                    loading={uploading}
                                >
                                    <SendOutlined />
                                </Button>
                        </div>
                    </Spin>
                </Card>{" "}
            </div>
        </>
    );
};
export default CreateChildComment;
