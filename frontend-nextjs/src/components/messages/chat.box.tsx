"use client";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/library/socket.context";
import { useSession } from "@/library/session.context";
import { Input, Button, Spin, Empty, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { getChatRoom } from "@/services/chat.service";

interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender?: {
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
    const { roomId } = props
    const session = useSession();
    const { socket, isConnected } = useSocket();
    const userId = session?.user?.id || "";
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load old messages
    useEffect(() => {
        const loadMessages = async () => {
            if (!roomId || !session?.user?.access_token) return;

            setIsLoading(true);
            try {
                const res = await getChatRoom(roomId);
                if (res.data) setMessages(res.data);
            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [roomId, session]);

    // Socket events
    useEffect(() => {
        if (!roomId || !socket || !isConnected) return;

        socket.emit("joinRoom", roomId);

        socket.on("receiveMessage", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.emit("leaveRoom", roomId);
            socket.off("receiveMessage");
        };
    }, [roomId, socket, isConnected]);

    // Send message
    const sendMessage = () => {
        if (!text.trim() || !isConnected) return;
        if (socket?.active) {
            socket.emit("sendMessage", {
                roomId,
                content: text.trim(),
            });
        }

        setText("");
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
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    padding: "20px",
                    backgroundColor: "#fff",
                    border: "1px solid #fff",
                    borderRadius: "10px",
                }}
            >
                {isLoading ? (
                    <Spin
                        tip="Đang tải..."
                        style={{ display: "block", margin: "50px auto" }}
                    />
                ) : messages.length === 0 ? (
                    <Empty description="Chưa có tin nhắn" />
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId === userId;
                        const name =
                            msg?.sender?.name ||
                            msg?.sender?.username ||
                            "Unknown";

                        return (
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
                                                    msg?.sender?.avatarColor ||
                                                    "#1890ff",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div style={{ maxWidth: "70%" }}>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                {name}
                                            </div>
                                            <div
                                                style={{
                                                    padding: "8px 12px",
                                                    backgroundColor: "#f2f2f2",
                                                    borderRadius: "8px",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Own message: Content only */}
                                {isOwn && (
                                    <div
                                        style={{
                                            maxWidth: "70%",
                                            padding: "8px 12px",
                                            backgroundColor: "#1890ff",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                )}
                            </div>
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
                }}
            >
                <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onPressEnter={sendMessage}
                        placeholder={
                            isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."
                        }
                        disabled={!isConnected}
                        size="large"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={sendMessage}
                        disabled={!isConnected || !text.trim()}
                        size="large"
                    >
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
