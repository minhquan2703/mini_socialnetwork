"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "@/library/socket.context";
import { useSession } from "@/library/session.context";
import {
    Input,
    Button,
    Spin,
    Empty,
    Form,
    UploadFile,
    Upload,
    Image,
} from "antd";
import type { RcFile, UploadProps } from "antd/es/upload/interface";
import {
    FileImageFilled,
    PlusOutlined,
    SendOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { createMessage, getMessages } from "@/services/chat.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DetailRoom from "./room.detail";
import "./chatbox.scss";
import { IMessage } from "@/types/room.type";
import Message from "./message";
interface props {
    roomId: string;
}

const ChatBox = (props: props) => {
    const { roomId } = props;
    const session = useSession();
    const { socket, isConnected } = useSocket();
    const [isBlocking, setIsBlocking] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const userId = session?.user?.id;
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isShowUpload, setIsShowUpload] = useState(false);
    const [isCheckingBlocked, setIsCheckingBlocked] = useState(true);
    const blobUrls = useRef<string[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as File);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //     //nhấn Enter mà không có Shift thì submit form
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault(); //ngăn xuống dòng mặc định
    //         form.submit();
    //     }
    // };

    const getStateBlock = () => {
        if (isBlocked && !isBlocking) {
            return "Bạn đã bị chặn";
        }
        if (!isBlocked && isBlocking) {
            return "Bạn đã chặn người này";
        }
        if (isBlocked && isBlocking) {
            return "Cuộc trò chuyện đã bị chặn";
        }
        return "Đang kiểm tra trạng thái chặn...";
    };

    const handleUrlFile = useCallback((file: UploadFile) => {
        if (!file.originFileObj) return;
        const url = URL.createObjectURL(file.originFileObj as RcFile);
        blobUrls.current.push(url);
        return url;
    }, []);
    useEffect(() => () => { blobUrls.current.forEach(URL.revokeObjectURL); }, []);


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
            const newFileList = fileList.filter((f) => f.uid !== file.uid);
            setFileList(newFileList);
        },
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
        },
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, [messages]);

    useEffect(() => {
        if (!session?.user) {
            router.push("/");
            return;
        }
        const loadMessages = async () => {
            setIsLoading(true);
            const res = await getMessages(roomId);
            if (res.data) {
                setMessages(Array.isArray(res.data) ? res.data : [res.data]);
            } else if (res.statusCode === 404 || res.statusCode === 400) {
                router.replace("/messages/notfound");
            } else if (res.statusCode === 403) {
                router.replace("/messages/notpermit");
            } else {
                toast.error("Lỗi không xác định, vui lòng đăng nhập lại");
                router.replace("/");
            }
            setIsLoading(false);
        };

        loadMessages();
    }, [roomId, router, session]);

    const handleTempMessage = (msg: IMessage) => {
        setMessages((prev) => [...prev, msg]);
    };
    const handleReceive = (msg: IMessage) => {
        setMessages((prev) => {
            if (msg.tempId) {
                return prev.map((m) => {
                    if (m.tempId === msg.tempId) {
                        return {
                            ...msg,
                            status: "success",
                        };
                    }
                    return m;
                });
            } else {
                const isDuplicate = prev.some((m) => m.id === msg.id);

                if (isDuplicate) {
                    return prev;
                }

                return [
                    ...prev,
                    {
                        ...msg,
                        status: "success",
                    },
                ];
            }
        });
    };

    const handleErrorMessage = (tempId: string, message: string) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m.tempId === tempId) {
                    return {
                        ...m,
                        status: "error",
                    };
                }
                return m;
            })
        );
        if (message === "Maximum is 1 video or 4 images") {
            toast.error("Chỉ được gửi tối đa 1 video hoặc 4 hình ảnh");
        } else {
            toast.error("Gửi tin nhắn thất bại, vui lòng thử lại");
        }
    };
    const handleBlockOrUnBlock = useCallback(
        (blocked: boolean) => {
            socket?.emit("handleBlockOrUnBlock", {
                blocked: blocked,
            });
        },
        [socket, roomId]
    );

    //socket events
    useEffect(() => {
        if (!socket) return;

        socket.emit("joinRoom", roomId);
        socket.on("message.success", handleReceive);
        socket.on("blockOrUnBlock", handleBlockAction);

        return () => {
            socket.emit("leaveRoom", roomId);
            socket.off("message.success");
            socket.off("blockOrUnBlock");
        };
    }, [socket, isConnected, roomId]);
    const handleBlockAction = (data: { blocked: boolean }) => {
        if (data.blocked === true) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
        setIsCheckingBlocked(false);
    };
    const validateFileList = (files: any[]) => {
        const firstFile = files[0].originFileObj || files[0];
        const firstFileType = firstFile.type;
        for (const file of files) {
            if (!file.type.includes("image") && !file.type.includes("video")) {
                return {
                    valid: false,
                    message: "Chỉ được gửi ảnh hoặc video",
                };
            }

            const sizeInMB =
                (file.size || (file.originFileObj || file).size) /
                (1024 * 1024);
            if (sizeInMB > 100) {
                return {
                    valid: false,
                    message: "file không được vượt quá 100 MB",
                };
            }
        }

        if (firstFileType.startsWith("video/")) {
            if (files.length > 1) {
                return {
                    valid: false,
                    message: "Video chỉ được gửi 1 file duy nhất",
                };
            }
        }

        if (firstFileType.startsWith("image/")) {
            const hasNonImage = files.some((file) => {
                const fileType = (file.originFileObj || file).type;
                return !fileType.startsWith("image/");
            });

            if (!hasNonImage && files.length > 4) {
                return {
                    valid: false,
                    message: "Tối đa chỉ được 4 ảnh",
                };
            }

            if (hasNonImage) {
                return {
                    valid: false,
                    message: "Khi gửi ảnh, chỉ được gửi các file ảnh",
                };
            }
        }

        return { valid: true };
    };
    const sendMessage = async (value: { messageText: string }) => {
        const { messageText } = value;
        if (messageText) {
            if (!messageText.trim() && fileList.length === 0) {
                toast.error("Tin nhắn không được để trống");
                return;
            }
        }
        if (fileList.length > 0) {
            const validation = validateFileList(fileList);
            if (!validation.valid) {
                toast.error(validation.message);
                return;
            }
        }
        if (socket?.active) {
            const tempId = `temp-${crypto.randomUUID()}`;
            handleTempMessage({
                id: tempId,
                tempId: tempId,
                content: messageText ? messageText.trim() : "",
                createdAtFormat: "",
                sender: {
                    id: session?.user?.id,
                    name: session?.user?.name,
                    username: session?.user?.username,
                    image: session?.user?.image,
                    avatarColor: session?.user?.avatarColor,
                },
                uploads: fileList,
                status: "sending",
            });

            const data = new FormData();
            data.append("roomId", roomId);
            data.append("content", messageText ? messageText.trim() : "");
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append("files", file.originFileObj);
                }
            });
            setIsShowUpload(false);
            form.resetFields();
            setFileList([]);
            const res = await createMessage(data);
            if (res.data) {
                socket.emit("notify.success", {
                    roomId: roomId,
                    id: res.data.message.id,
                    tempId: tempId,
                    content: res.data.message.content,
                    createdAt: res.data.message.createdAt,
                    sender: {
                        id: res.data.sender.id,
                        name: res.data.sender.name,
                        username: res.data.sender.username,
                        image: res.data.sender.image,
                        avatarColor: res.data.sender.avatarColor,
                    },
                    uploads: res.data.uploads,
                });
            }
            if (res.error) {
                handleErrorMessage(tempId, res.message);
            }
        }
    };

    const uploadButton = (
        <button className="upload-btn" type="button">
            <span className="icon-wrapper">
                <FileImageFilled className="main-icon" />
                <PlusOutlined className="plus-icon" />
            </span>
        </button>
    );
    if (!roomId) {
        return (
            <div className="chatbox-loading-container">
                <Spin tip="Đang tải..." size="large">
                    <></>
                </Spin>
            </div>
        );
    }

    return (
        <>
            <div className="chatbox-root">
                <div className="chatbox-main">
                    {/* Messages */}
                    <div className="chatbox-messages">
                        {isLoading ? (
                            <Spin tip="Đang tải..." className="chatbox-spin">
                                <></>
                            </Spin>
                        ) : messages.length === 0 ? (
                            <Empty description="Chưa có tin nhắn" />
                        ) : (
                            messages.map((msg) => {
                                const isOwn = msg.sender?.id === userId;
                                const name =
                                    msg?.sender?.name ||
                                    msg?.sender?.username ||
                                    "Unknown";

                                return (
                                    <Message
                                        key={msg.id}
                                        isOwn={isOwn}
                                        msg={msg}
                                        name={name}
                                        handleUrlFile={handleUrlFile}
                                    />
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbox-input-container">
                        {/* upload image */}
                        {isShowUpload && (
                            <>
                                {/* <div style={{display:"flex"}}> */}
                                <Upload
                                    listType="picture-circle"
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                    {...uploadProps}
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                >
                                    {fileList.length > 4 ? null : uploadButton}
                                </Upload>
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
                                        alt=""
                                    />
                                )}
                                {/* </div> */}
                            </>
                        )}
                        {!isBlocked && !isBlocking ? (
                            <Form
                                form={form}
                                size="middle"
                                onFinish={sendMessage}
                                autoComplete="off"
                                className="chatbox-form"
                                disabled={isCheckingBlocked}
                            >
                                <Button
                                    className={
                                        isShowUpload
                                            ? "btn-upload-active"
                                            : "btn-upload"
                                    }
                                    icon={<UploadOutlined />}
                                    onClick={() =>
                                        setIsShowUpload(!isShowUpload)
                                    }
                                />
                                <Form.Item
                                    label=""
                                    name="messageText"
                                    className="chatbox-form-message"
                                    rules={
                                        fileList.length === 0
                                            ? [
                                                  {
                                                      required: true,
                                                      message: "",
                                                  },
                                              ]
                                            : []
                                    }
                                    style={{ marginBottom: 0, flex: 1 }}
                                >
                                    <Input
                                        placeholder="Nhập tin nhắn..."
                                        autoFocus
                                        // onKeyDown={handleKeyDown}
                                        style={{
                                            resize: "none",
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        color="default"
                                        icon={<SendOutlined />}
                                        className="chatbox-btn-send"
                                        variant="solid"
                                        htmlType="submit"
                                        size="middle"
                                        disabled={!isConnected}
                                    >
                                        Gửi
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {getStateBlock()}
                            </div>
                        )}
                    </div>
                </div>
                <div className="chatbox-detail-room">
                    <DetailRoom
                        roomId={roomId}
                        isBlocking={isBlocking}
                        setIsBlocking={setIsBlocking}
                        isBlocked={isBlocked}
                        setIsBlocked={setIsBlocked}
                        isCheckingBlocked={isCheckingBlocked}
                        setIsCheckingBlocked={setIsCheckingBlocked}
                        handleBlockOrUnBlock={handleBlockOrUnBlock}
                        setIsShowUpload={setIsShowUpload}
                    />
                </div>
            </div>
        </>
    );
};

export default ChatBox;
