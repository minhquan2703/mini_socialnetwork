"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    HomeFilled,
    TeamOutlined,
    SettingOutlined,
    WhatsAppOutlined,
    FacebookFilled,
    LinkedinFilled,
    GoogleCircleFilled,
    BugFilled,
} from "@ant-design/icons";
import React from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { Avatar, Card } from "antd";
import { useSession } from "@/library/session.context";

type MenuItem = Required<MenuProps>["items"][number];

const MessagesDetail = () => {
    const session = useSession();
    const { Sider } = Layout;

    const items: MenuItem[] = [
        {
            key: "grp",
            type: "group",
            children: [
                {
                    key: "profile",
                    label: "Xem hồ sơ",
                    icon: <HomeFilled />,
                    onClick: () => alert("Tính năng đang phát triển"),
                },
                {
                    key: "block",
                    label: "Chặn người dùng",
                    icon: <TeamOutlined />,
                    onClick: () => alert("Tính năng đang phát triển"),
                },
                {
                    key: "settings",
                    label: "Cài đặt",
                    icon: <SettingOutlined />,
                    onClick: () => alert("Tính năng đang phát triển"),
                },
                {
                    type: "divider",
                },
                {
                    key: "contact",
                    label: "Hình ảnh/Video",
                    icon: <WhatsAppOutlined />,
                    children: [
                        {
                            key: "9",
                            label: (
                                <Link
                                    href={"https://www.facebook.com/pmq0207/"}
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </Link>
                            ),
                            icon: <FacebookFilled />,
                        },
                        {
                            key: "10",
                            label: (
                                <Link
                                    href={
                                        "https://www.linkedin.com/in/minhquan02073/"
                                    }
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Linkedin
                                </Link>
                            ),
                            icon: <LinkedinFilled />,
                        },
                        {
                            key: "11",
                            label: (
                                <Link
                                    href={"mailto:minhquan02073@gmail.com"}
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Email
                                </Link>
                            ),
                            icon: <GoogleCircleFilled />,
                            onClick: () => alert("minhquan02073@gmail.com"),
                        },
                    ],
                },
            ],
        },
    ];

    return (
        <Sider
            style={{
                background: "#fff",
            }}
            width="100%"
        >
            {/* User Profile Section */}
            <Card
                variant="borderless"
                styles={{
                    body: {
                        padding: "24px 16px",
                        borderBottom: "1px solid #f0f0f0",
                    },
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    {!session?.user ? (
                        <Avatar
                            size={44}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "600",
                            }}
                        >
                            <BugFilled />
                        </Avatar>
                    ) : (
                        <Avatar
                            size={44}
                            src={session?.user?.image}
                            style={{
                                backgroundColor:
                                    `${session?.user?.avatarColor}` || "#fff",
                                color: "#222",
                                fontSize: "20px",
                                fontWeight: "600",
                            }}
                        >
                            {session?.user?.name?.charAt(0).toUpperCase() ||
                                session?.user?.username
                                    ?.charAt(0)
                                    .toUpperCase()}
                        </Avatar>
                    )}

                    <div style={{ overflow: "hidden" }}>
                        <div
                            style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#000",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {session?.user?.name || "Dân thường A"}
                        </div>
                        <div
                            style={{
                                fontSize: "13px",
                                color: "#666",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {session?.user && <>@{session?.user?.username}</>}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Navigation Menu */}
            <Menu
                mode="inline"
                defaultSelectedKeys={["home"]}
                items={items}
                style={{
                    borderRight: "none",
                    marginTop: "8px",
                }}
            />
        </Sider>
    );
};

export default MessagesDetail;
