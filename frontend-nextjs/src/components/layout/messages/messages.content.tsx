"use client";

import { Layout } from "antd";

const MessagesContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content
            style={{
                height: "calc(100vh - 78px)", // Điều chỉnh theo header height thực tế
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: 10,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#ffffff",
                    }}
                >
                    {children}
                </div>
            </div>
        </Content>
    );
};

export default MessagesContent;
