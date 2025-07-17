"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    HomeFilled,
    MessageOutlined,
    TeamOutlined,
    SettingOutlined,
    WhatsAppOutlined,
    FacebookFilled,
    LinkedinFilled,
    GoogleCircleFilled,
    AppstoreOutlined,
    BugFilled,
} from "@ant-design/icons";
import React from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { Avatar, Card } from "antd";
import { useSession } from "@/library/session.context";

type MenuItem = Required<MenuProps>["items"][number];

const UserSideBar = () => {
    const session = useSession();
    const { Sider } = Layout;

    const items: MenuItem[] = [
        {
            key: "grp",
            type: "group",
            children: [
                {
                    key: "home",
                    label: (
                        <Link
                            href={"/"}
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            Trang chủ
                        </Link>
                    ),
                    icon: <HomeFilled />,
                    onClick: () => alert("Tính năng đang phát triển"),
                },
                {
                    key: "messages",
                    label: (
                        <Link
                            href={"/messages"}
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                Tin nhắn
                            </div>
                        </Link>
                    ),
                    icon: <MessageOutlined />,
                },
                // {
                //     key: "friends",
                //     label: (
                //         <Link
                //             href={"/"}
                //             style={{ color: "inherit", textDecoration: "none" }}
                //         >
                //             Bạn bè
                //         </Link>
                //     ),
                //     icon: <TeamOutlined />,
                //     onClick: () => alert("Tính năng đang phát triển"),
                // },
                // {
                //     key: "stories",
                //     label: "Bảng tin",
                //     icon: <AppstoreOutlined />,
                //     children: [
                //         { key: "5", label: "Tin của bạn" },
                //         { key: "6", label: "Kho lưu trữ" },
                //     ],
                // },
                // {
                //     key: "settings",
                //     label: (
                //         <Link
                //             href={"/"}
                //             style={{ color: "inherit", textDecoration: "none" }}
                //         >
                //             Cài đặt
                //         </Link>
                //     ),
                //     icon: <SettingOutlined />,
                //     onClick: () => alert("Tính năng đang phát triển"),
                // },
                // {
                //     type: "divider",
                // },
                {
                    key: "contact",
                    label: "Liên hệ với tôi",
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
    const itemsNotAuth: MenuItem[] = [
        {
            key: "grp",
            type: "group",
            children: [
                {
                    key: "home",
                    label: (
                        <Link
                            href={"/"}
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            Trang chủ
                        </Link>
                    ),
                    icon: <HomeFilled />,
                },
                {
                    key: "stories",
                    label: "Bảng tin",
                    icon: <AppstoreOutlined />,
                    onClick: () => alert("Tính năng đang phát triển"),
                },
                {
                    type: "divider",
                },
                {
                    key: "contact",
                    label: "Liên hệ với tôi",
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
            width={220}
            style={{
                background: "#fff",
                borderRight: "1px solid #f0f0f0",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100vh",
                zIndex: 100,
            }}
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
                items={!session?.user?.id ? itemsNotAuth : items}
                style={{
                    borderRight: "none",
                    marginTop: "8px",
                }}
            />
        </Sider>
    );
};

export default UserSideBar;
