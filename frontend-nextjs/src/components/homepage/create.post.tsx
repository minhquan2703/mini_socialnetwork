import { postNewOne } from "@/services/post.service";
import {
    GlobalOutlined,
    PictureOutlined,
    SendOutlined,
    SmileOutlined,
    CloseOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Input,
    Space,
    Upload,
    Image,
    message,
    Spin,
} from "antd";
import { useState } from "react";
import type { UploadFile, UploadProps } from "antd";

const CreatePostForm = ({ session, onPostCreated }) => {
    const { TextArea } = Input;
    const [newPost, setNewPost] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const { Dragger } = Upload;

    // Xử lý submit post
    const handleSubmit = async () => {

        setUploading(true);

        try {
            // Chuẩn bị FormData
            const formData = new FormData();
            formData.append("content", newPost.trim());

            // Phân loại files theo backend requirements
            const images: File[] = [];
            let video: File | null = null;

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    const fileType = file.type || file.originFileObj.type;
                    if (fileType.startsWith("image/")) {
                        images.push(file.originFileObj);
                    } else if (fileType.startsWith("video/")) {
                        video = file.originFileObj;
                    }
                }
            });

            // Validate theo backend rules
            if (video && images.length > 0) {
                message.error("Không thể upload cả video và ảnh cùng lúc");
                setUploading(false);
                return;
            }

            if (images.length > 9) {
                message.error("Tối đa 9 ảnh mỗi post");
                setUploading(false);
                return;
            }
            // Append images với field name "images"
            images.forEach((image) => {
                formData.append("images", image);
            });

            // Append video với field name "video"
            if (video) {
                formData.append("video", video);
            }
            const res = await postNewOne(formData);
            console.log("check res post new one", res);

            if (res?.data) {
                message.success("Đăng bài thành công!");
                setNewPost("");
                setFileList([]);
                setShowUpload(false);
                if (onPostCreated) {
                    onPostCreated(res.data);
                }
            } else {
                message.error(res?.message || "Đăng bài thất bại");
            }
        } catch (error) {
            console.error("Submit error:", error);
            message.error("Có lỗi xảy ra khi đăng bài");
        } finally {
            setUploading(false);
        }
    };

    // Preview handler
    const handlePreview = async (file: UploadFile) => {
        if (file.type?.startsWith("video/")) {
            // Mở video trong tab mới
            const url =
                file.url || URL.createObjectURL(file.originFileObj as File);
            window.open(url, "_blank");
            return;
        }

        // Preview ảnh
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    // Upload props
    const uploadProps: UploadProps = {
        listType: "picture-card",
        fileList,
        multiple: true,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            if (!isImage && !isVideo) {
                message.error("Chỉ cho phép upload ảnh hoặc video!");
                return false;
            }

            // Kiểm tra size - Backend có thể validate khác
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error("File phải nhỏ hơn 50MB!");
                return false;
            }

            // Validate theo backend rules
            if (isVideo) {
                const hasVideo = fileList.some((f) =>
                    f.type?.startsWith("video/")
                );
                if (hasVideo) {
                    message.error("Chỉ được upload 1 video!");
                    return false;
                }
                // Không cho phép video + ảnh
                const hasImage = fileList.some((f) =>
                    f.type?.startsWith("image/")
                );
                if (hasImage) {
                    message.error("Không thể upload cả video và ảnh cùng lúc!");
                    return false;
                }
            }

            if (isImage) {
                // Không cho phép ảnh + video
                const hasVideo = fileList.some((f) =>
                    f.type?.startsWith("video/")
                );
                if (hasVideo) {
                    message.error("Không thể upload cả video và ảnh cùng lúc!");
                    return false;
                }
                // Giới hạn 10 ảnh
                const imageCount = fileList.filter((f) =>
                    f.type?.startsWith("image/")
                ).length;
                if (imageCount >= 10) {
                    message.error("Tối đa 10 ảnh mỗi post!");
                    return false;
                }
            }

            return false; // Không auto upload
        },
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

    return (
        <>
            {session?.user ? (
                <Card
                    style={{
                        marginBottom: "24px",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "none",
                    }}
                    styles={{ body: { padding: "20px" } }}
                >
                    <Spin spinning={uploading} tip="Đang đăng bài...">
                        <div style={{ display: "flex", gap: "16px" }}>
                            <Avatar
                                size={48}
                                style={{
                                    backgroundColor: `${session?.user?.avatarColor}`,
                                    flexShrink: 0,
                                    fontSize: "24px",
                                    fontWeight: "600",
                                    color: "#222",
                                }}
                                src={session?.user?.image}
                            >
                                {session?.user?.name?.charAt(0).toUpperCase() ||
                                    session?.user?.username
                                        ?.charAt(0)
                                        .toUpperCase()}
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

                                {/* Upload area */}
                                {showUpload && (
                                    <div style={{ marginTop: "16px" }}>
                                        <Dragger {...uploadProps} fileList={fileList}>
                                            {fileList.length < 10 && (
                                                <div>
                                                    <PictureOutlined
                                                        style={{
                                                            fontSize: "20px",
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        Thêm ảnh/video
                                                    </div>
                                                </div>
                                            )}
                                        </Dragger>
                                        <div
                                            style={{
                                                marginTop: "8px",
                                                fontSize: "12px",
                                                color: "#666",
                                            }}
                                        >
                                            • Tối đa 9 ảnh HOẶC 1 video (không
                                            thể kết hợp)
                                            <br />• Kích thước tối đa: 50MB/file
                                        </div>
                                    </div>
                                )}

                                <Divider style={{ margin: "16px 0" }} />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Space size={24}>
                                        <Button
                                            type="text"
                                            icon={<PictureOutlined />}
                                            style={{
                                                color: showUpload
                                                    ? "#1890ff"
                                                    : "#666",
                                                fontWeight: showUpload
                                                    ? 500
                                                    : 400,
                                            }}
                                            onClick={() =>
                                                setShowUpload(!showUpload)
                                            }
                                        >
                                            Ảnh/Video
                                            {fileList.length > 0 && (
                                                <span
                                                    style={{
                                                        marginLeft: "4px",
                                                        color: "#1890ff",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ({fileList.length})
                                                </span>
                                            )}
                                        </Button>
                                        <Button
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
                                        </Button>
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
                                        onClick={handleSubmit}
                                        loading={uploading}
                                    >
                                        Đăng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Spin>

                    {/* Image Preview Modal */}
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
                        />
                    )}
                </Card>
            ) : (
                <></>
            )}
        </>
    );
};

export default CreatePostForm;
