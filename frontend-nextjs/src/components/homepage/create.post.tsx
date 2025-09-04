"use client";
import {
    PictureOutlined,
    SendOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Input, Space, Spin } from "antd";
import { useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { Image, Upload } from "antd";
import { toast } from "sonner";
import { useSession } from "@/library/session.context";
import { HomePageProps } from "./homepage";
import { postNewPost } from "@/services/post.service";
const CreatePostForm = (props: HomePageProps) => {
    const { handlePostCreated } = props;
    const { TextArea } = Input;
    const [newPost, setNewPost] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [isShowUpload, setIsShowUpload] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { Dragger } = Upload;
    const session = useSession();
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as File);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const uploadProps: UploadProps = {
        listType: "picture-card",
        fileList,
        multiple: true,
        beforeUpload: () => false,
        onChange: ({ fileList: newFileList }) => {
            setFileList(newFileList);
        },
        onPreview: handlePreview,
        onRemove: (file) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
        },
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
        },
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const data = new FormData();
        data.append("content", newPost.trim());
        fileList.forEach((file) => {
            if (file.originFileObj) {
                data.append("files", file.originFileObj);
            }
        });
        const res = await postNewPost(data);
        if (handlePostCreated && res?.data) {
            setNewPost("");
            setFileList([]);
            handlePostCreated(res.data);

            setIsLoading(false);
            toast.success("Đăng bài viết thành công");
        } else {
            setIsLoading(false);
            toast.error(res.message);
        }
    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: "none",
                height: "60px",
            }}
            type="button"
        >
            <InboxOutlined style={{ fontSize: "30px" }} />
            <div style={{ marginTop: 8, fontSize: "15px", color: "#bbb" }}>
                Tối đa 50MB / 9 hình ảnh hoặc 1 video
            </div>
        </button>
    );

    if (!session?.user) return null;

    return (
        <Card
            style={{
                marginBottom: "24px",
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
                boxShadow: "none",
            }}
            styles={{ body: { padding: "20px" } }}
        >
            <Spin spinning={isLoading} tip="Đang đăng bài...">
                <div style={{ display: "flex", gap: "16px" }}>
                    <Avatar
                        size={48}
                        style={{
                            backgroundColor: `${session?.user?.avatarColor}`,
                            flexShrink: 0,
                            fontSize: "20px",
                            color: "#222",
                            fontWeight: "600",
                        }}
                        src={session?.user?.image}
                    >
                        {session?.user?.name?.charAt(0).toUpperCase() ||
                            session?.user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                        <TextArea
                            placeholder="Bạn đang nghĩ gì?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 5 }}
                            style={{
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                padding: "12px 0",
                                resize: "none",
                            }}
                        />
                        <Divider style={{ margin: "16px 0" }} />
                        {/* upload image */}
                        {isShowUpload && 
                            <>
                                <Dragger
                                    style={{ marginBottom: "10px" }}
                                    {...uploadProps}
                                    fileList={fileList}
                                >
                                    {fileList.length > 8 ? null : uploadButton}
                                </Dragger>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{ display: "none" }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(""),
                                        }}
                                        src={previewImage}
                                        alt="preview"
                                    />
                                )}
                            </>
                        }

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "10px",
                            }}
                        >
                            <Space size={24}>
                                <Button
                                    type="text"
                                    icon={<PictureOutlined />}
                                    style={{
                                        color: `${
                                            isShowUpload ? "#1677ff" : "#666"
                                        }`,
                                    }}
                                    onClick={() =>
                                        setIsShowUpload(!isShowUpload)
                                    }
                                >
                                    Ảnh/Video
                                </Button>
                                {/* <Button
                                    type="text"
                                    icon={<SmileOutlined />}
                                    style={{ color: "#666" }}
                                >
                                    Cảm xúc
                                </Button>
                                <Button
                                    type="text"
                                    icon={<GlobalOutlined />}
                                    style={{ color: "#666" }}
                                >
                                    Vị trí
                                </Button> */}
                            </Space>
                            <Button
                                color="default"
                                variant="solid"
                                icon={<SendOutlined />}
                                style={{
                                    fontWeight: "500",
                                    padding: "15px 20px",
                                }}
                                disabled={!newPost.trim()}
                                onClick={() => handleSubmit()}
                            >
                                Đăng
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>
        </Card>
    );
};
export default CreatePostForm;
