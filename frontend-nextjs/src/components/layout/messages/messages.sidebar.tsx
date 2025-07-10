"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    ArrowLeftOutlined,
    MessageOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { Button, Avatar } from "antd";
import { getListRooms } from "@/services/chat.service";
import { toast } from "sonner";
import { IRoom } from "@/types/room.type";

type MenuItem = Required<MenuProps>["items"][number];


const MessagesSideBar = () => {
    const { Sider } = Layout;
    const [rooms, setRooms] = useState<IRoom[]>([]);

    useEffect(() => {
        fetchListRooms();
    }, []);
    const fetchListRooms = async () => {
        const res = await getListRooms();
        if (res.data) {
            setRooms(res.data);
        } else {
            toast.error("Có lỗi xảy ra, vui lòng đăng nhập lại");
        }
    };

    const menuItems: MenuItem[] = [
        {
            key: "all-messages",
            label: <Link href="/messages">Tất cả</Link>,
            icon: <MessageOutlined />,
        },
        // {
        //     key: "groups",
        //     label: <Link href="/messages/groups">Nhóm</Link>,
        //     icon: <TeamOutlined />,
        // },
    ];

    return (
        <Sider
            style={{
                background: "#fff",
                borderRight: "1px solid #f0f0f0",
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0,
            }}
            width="100%"
        >
            {/* Header */}
            <div
                style={{
                    padding: "20px",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Link href="/">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            style={{ padding: "4px 8px" }}
                        />
                    </Link>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 600,
                            flex: 1,
                            textAlign: "center",
                        }}
                    >
                        Tin nhắn
                    </h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        shape="circle"
                        size="small"
                    />{" "}
                </div>

                {/* Search Bar */}
                {/* <Input
                    placeholder="Tìm kiếm tin nhắn..."
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{
                        borderRadius: "20px",
                        backgroundColor: "#f5f5f5",
                        border: "none",
                    }}
                /> */}
            </div>

            {/* Navigation Menu */}
            <div
                style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["all-messages"]}
                    items={menuItems}
                    style={{
                        border: "none",
                        justifyContent: "space-around",
                        minHeight: "auto",
                    }}
                />
            </div>

            {/* Recent Chats */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px",
                }}
            >
                {rooms.map((room) => (
                    <Link
                        key={room.id}
                        href={`/messages/${room.id}`}
                        style={{ textDecoration: "none" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px",
                                borderRadius: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                marginBottom: "4px",
                                backgroundColor: "#f6f8fa",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f0f2f5";
                            }}
                        >
                            <Avatar
                                src={room.receiver?.image}
                                size={48}
                                style={{
                                    backgroundColor:
                                        room.receiver?.avatarColor && "#fff",
                                }}
                            >
                                {(room.receiver?.username &&
                                    room.lastestMessage?.sender?.name?.charAt(
                                        0
                                    )) ||
                                    room.lastestMessage?.sender?.username?.charAt(
                                        0
                                    )}
                            </Avatar>

                            <div
                                style={{
                                    flex: 1,
                                    marginLeft: "12px",
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "15px",
                                            color: "#262626",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {room.receiver.name ||
                                            room.receiver.username}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#1890ff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {room.lastestMessage?.timeBefore}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#8c8c8c",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {room.lastestMessage?.sender.name}:{" "}
                                        {room.lastestMessage?.content}
                                    </span>
                                    {/* {chat.unread > 0 && (
                                            <Badge 
                                                count={chat.unread}
                                                style={{ 
                                                    backgroundColor: '#1890ff',
                                                }}
                                            />
                                        )} */}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Settings */}
            <div
                style={{
                    borderTop: "1px solid #f0f0f0",
                    padding: "16px",
                }}
            ></div>
        </Sider>
    );
};

export default MessagesSideBar;
