"use client";
import { IMessage } from "@/types/room.type";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Image, Tooltip, UploadFile } from "antd";
import React from "react";

interface MessageProps {
    isOwn: boolean;
    msg: IMessage;
    name: string;
    handleUrlFile: (file: UploadFile) => string | undefined;
}

const Message = (props: MessageProps) => {
    const { isOwn, msg, name, handleUrlFile } = props;
    return (
        <>
            <div
                key={msg.id}
                className={`chatbox-message-row ${
                    isOwn ? "chatbox-message-own" : "chatbox-message-other"
                }`}
            >
                {/* Other's message: Avatar + Name + Content */}
                {!isOwn && (
                    <>
                        <Avatar
                            src={msg.sender?.image}
                            style={{
                                backgroundColor:
                                    msg?.sender?.avatarColor || "#1890ff",
                                flexShrink: 0,
                                color: "#000",
                                fontWeight: 600,
                            }}
                        >
                            {name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="chatbox-message-info">
                            <div className="chatbox-message-sender">{name}</div>
                            <Tooltip
                                title={msg.createdAtFormat}
                                placement="left"
                            >
                                {msg.uploads && msg.uploads.length > 1 && (
                                    <div className="message-image-container">
                                        {msg.uploads.map((file, id) => (
                                            <Image
                                                key={id}
                                                src={
                                                    file.url ||
                                                    handleUrlFile(file)
                                                }
                                                className="img"
                                                alt=""
                                                preview={true}
                                            />
                                        ))}
                                    </div>
                                )}
                                {msg.uploads &&
                                    msg.uploads[0]?.type?.includes("video") && (
                                        <div className="message-video-container-own">
                                            {msg.uploads.map((file, id) => (
                                                <video
                                                    key={id}
                                                    className="video"
                                                    controls
                                                    src={
                                                        file.url || handleUrlFile(file)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                {msg.uploads?.length === 1 &&
                                    msg.uploads[0]?.type?.includes("image") && (
                                        <>
                                            <Image
                                                src={
                                                    msg.uploads[0].url || handleUrlFile(msg.uploads[0])
                                                }
                                                className="single-img"
                                                alt=""
                                                preview={true}
                                            />
                                        </>
                                    )}
                                {msg.content && (
                                    <div className="chatbox-message-content">
                                        {msg.content}
                                    </div>
                                )}
                            </Tooltip>
                        </div>
                    </>
                )}

                {/* Own message: Content only */}
                {isOwn && (
                    <div className="chatbox-message-info-own">
                        <Tooltip title={msg.createdAtFormat} placement="right">
                            <div className="chatbox-own-content-wrapper">
                                {msg.uploads &&
                                    msg.uploads.length > 1 &&
                                    msg.uploads[0]?.type?.includes("image") && (
                                        <div className="message-image-container-own">
                                            {msg.uploads.map((file, id) => (
                                                <Image
                                                    key={id}
                                                    src={
                                                        file.url || handleUrlFile(file)
                                                    }
                                                    className="img"
                                                    alt=""
                                                    preview={true}
                                                />
                                            ))}
                                        </div>
                                    )}
                                {msg.uploads &&
                                    msg.uploads[0]?.type?.includes("video") && (
                                        <div className="message-video-container-own">
                                            {msg.uploads.map((file, id) => (
                                                <video
                                                    key={id}
                                                    className="video"
                                                    controls
                                                    src={
                                                        file.url || handleUrlFile(file)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                {msg.uploads?.length === 1 &&
                                    msg.uploads[0]?.type?.includes("image") && (
                                        <>
                                            <Image
                                                src={
                                                    msg.uploads[0].url || handleUrlFile(msg.uploads[0])
                                                }
                                                className="single-img"
                                                alt=""
                                                preview={true}
                                            />
                                        </>
                                    )}
                                {msg.content && (
                                    <div className="chatbox-message-content chatbox-message-content-own">
                                        {msg.content}
                                    </div>
                                )}
                                {msg.status === "sending" && (
                                    <span className="message-status message-status-sending">
                                        Đang gửi...
                                    </span>
                                )}
                                {msg.status === "error" && (
                                    <span className="message-status message-status-error">
                                        <ExclamationCircleOutlined /> Gửi thất bại
                                    </span>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>
        </>
    );
};
export default React.memo(Message);
