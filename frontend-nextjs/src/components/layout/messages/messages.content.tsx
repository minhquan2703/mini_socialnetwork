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
                height: "calc(100vh - 55px)", //diều chỉnh theo header height thực tế
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",                
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    background: "#ffffff",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                {children}
            </div>
        </Content>
    );
};

export default MessagesContent;
