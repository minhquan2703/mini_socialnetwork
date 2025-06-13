"use client";
import { SearchOutlined, BellFilled } from "@ant-design/icons";
import { Input, Layout, Avatar, Dropdown, Badge, Button, Space } from "antd";
import type { MenuProps } from "antd";
import { signOut } from "next-auth/react";

const UserHeader = (props: any) => {
    const { session } = props;
    const { Header } = Layout;
    const dropdownItems: MenuProps["items"] = [
        {
            key: "profile",
            label: "Trang cá nhân",
        },
        {
            key: "settings",
            label: "Thông tin tài khoản",
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            danger: true,
            label: "Đăng xuất",
            onClick: () => signOut(),
        },
    ];

    return (
        <Header
            style={{
                position: "fixed",
                top: 0,
                left: "220px",
                right: 0,
                height: "64px",
                background: "#ffffff",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                zIndex: 99,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    letterSpacing: "-0.5px",
                    color: "#000",
                }}
            >
                Minh Quân
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: "420px", margin: "0 48px" }}>
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    size="large"
                    style={{
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        borderColor: "#f0f0f0",
                    }}
                    styles={{
                        input: {
                            fontSize: "14px",
                            color: "#000",
                        },
                        prefix: {
                            color: "#999",
                        },
                    }}
                />
            </div>

            {/* Right Section */}
            {!session?.user ? (
                <div style={{ display: "flex", gap: "15px" }}>
                    <Button
                        style={{ width: "100px", height: "35px", fontSize: "14px" }}
                        color="cyan"
                        variant="solid"
                        href="/auth/register"
                    >
                        Đăng ký
                    </Button>
                    <Button
                        style={{ width: "100px", height: "35px", fontSize: "14px" }}
                        color="cyan"
                        variant="outlined"
                        href="/auth"
                    >
                        Đăng nhập
                    </Button>
                </div>
            ) : (
                <Space size={12}>
                    {/* Notifications */}
                    <Button
                        type="text"
                        shape="circle"
                        size="large"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        icon={
                            <Badge count={`99+`} size="small" color="#FF4D4F">
                                <BellFilled
                                    style={{ fontSize: "20px", color: "#333" }}
                                />
                            </Badge>
                        }
                    />

                    {/* User Dropdown */}
                    <Dropdown
                        menu={{ items: dropdownItems }}
                        placement="bottomRight"
                        trigger={["click"]}
                        popupRender={(menu) => (
                            <div
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                {menu}
                            </div>
                        )}
                    >
                        <Button
                            type="text"
                            shape="circle"
                            size="large"
                            style={{
                                padding: 0,
                                width: "40px",
                                height: "40px",
                            }}
                            icon={
                                <Avatar
                                    size={36}
                                    src={session?.user?.image}
                                    style={{
                                        backgroundColor: `${session?.user?.avatarColor}`,
                                        border: "1px solid #f0f0f0",
                                        color: "#222",
                                        fontWeight: "600",
                                        fontSize: "16px",
                                    }}
                                >
                                    {session?.user?.name
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                        session?.user?.username
                                            ?.charAt(0)
                                            .toUpperCase()}
                                </Avatar>
                            }
                        />
                    </Dropdown>
                </Space>
            )}
        </Header>
    );
};

export default UserHeader;
