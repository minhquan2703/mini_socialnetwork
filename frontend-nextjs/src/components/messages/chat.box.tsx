"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "@/library/socket.context";
import { useSession } from "@/library/session.context";
import { Input, Button, Spin, Empty, Avatar, Form, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { getDetailRoom, getMessages } from "@/services/chat.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DetailRoom from "./room.detail";
import { IDetailRoom } from "@/types/room.type";

interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAtFormat: string;
    sender?: {
        id: string;
        name: string;
        username: string;
        image?: string;
        avatarColor?: string;
    };
}
interface props {
    roomId: string;
}

const ChatBox = (props: props) => {
    const { roomId } = props;
    const session = useSession();
    const { socket, isConnected } = useSocket();
    const userId = session?.user?.id || "";
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [form] = Form.useForm();
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const loadMessages = async () => {
            if (!session?.user?.access_token) {
                toast.error("Vui lòng đặng nhập để tiếp tục");
                router.replace("/auth");
            }

            setIsLoading(true);
            const res = await getMessages(roomId);
            if (res.data) {

                setMessages(res.data);
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

    const handleReceive = useCallback((msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    }, []);
    //socket events
    useEffect(() => {
        if (!socket) return;

        socket.emit("joinRoom", roomId);
        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.emit("leaveRoom", roomId);
            socket.off("receiveMessage");
        };
    }, [socket, isConnected]);

    const sendMessage = (value: any) => {
        const { messageText } = value;
        if (!messageText || !isConnected) return;
        if (socket?.active) {
            socket.emit("sendMessage", {
                roomId,
                content: messageText.trim(),
            });
        }
        form.resetFields();
    };

    if (!roomId || !session) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "50px",
                }}
            >
                <Spin tip="Đang tải..." size="large">
                    <></>
                </Spin>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    maxHeight: "calc(100vh - 55px)",
                    height: "calc(100vh - 55px)",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: "100",
                        width: "65%",
                    }}
                >
                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            scrollbarWidth: "none",
                            overflowY: "auto",
                            overflowX: "hidden",
                            padding: "20px",
                            backgroundColor: "#fff",
                            border: "1px solid #fff",
                            borderRadius: "10px",
                        }}
                    >
                        {isLoading ? (
                            <Spin
                                tip="Đang tải..."
                                style={{
                                    display: "block",
                                    margin: "50px auto",
                                }}
                            >
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
                                    <>
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: isOwn
                                                    ? "flex-end"
                                                    : "flex-start",
                                                marginBottom: "15px",
                                                gap: "10px",
                                            }}
                                        >
                                            {/* Other's message: Avatar + Name + Content */}
                                            {!isOwn && (
                                                <>
                                                    <Avatar
                                                        src={msg?.sender?.image}
                                                        style={{
                                                            backgroundColor:
                                                                msg?.sender
                                                                    ?.avatarColor ||
                                                                "#1890ff",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                    <div
                                                        style={{
                                                            maxWidth: "70%",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#666",
                                                                marginBottom:
                                                                    "2px",
                                                            }}
                                                        >
                                                            {name}
                                                        </div>
                                                        <Tooltip
                                                            title={
                                                                msg.createdAtFormat
                                                            }
                                                            placement="left"
                                                        >
                                                            {" "}
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "8px 12px",
                                                                    backgroundColor:
                                                                        "#f2f2f2",
                                                                    borderRadius:
                                                                        "8px",
                                                                    wordBreak:
                                                                        "break-word",
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </>
                                            )}

                                            {/* Own message: Content only */}
                                            {isOwn && (
                                                <Tooltip
                                                    title={msg.createdAtFormat}
                                                    placement="right"
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth: "70%",
                                                            padding: "8px 12px",
                                                            backgroundColor:
                                                                "#1890ff",
                                                            color: "#fff",
                                                            borderRadius: "8px",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "#fff",
                            borderTop: "1px solid #e8e8e8",
                            borderRadius: "0 0 10px 10px",
                            flexShrink: 0,
                        }}
                    >
                        <Form
                            form={form}
                            size="middle"
                            onFinish={sendMessage}
                            autoComplete="off"
                            style={{ display: "flex", gap: "10px" }}
                        >
                            <Form.Item
                                label=""
                                name="messageText"
                                style={{ width: "90%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: "",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tin nhắn..." />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    color="default"
                                    icon={<SendOutlined />}
                                    variant="solid"
                                    htmlType="submit"
                                    size="middle"
                                    disabled={!isConnected}
                                >
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div
                    style={{ width: "35%", height: "100%", overflow: "hidden" }}
                >
                    <DetailRoom roomId={roomId}/>
                </div>
            </div>
        </>
    );
};

export default ChatBox;
