"use client";
import { Layout } from "antd";

const MessagesFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer
                style={{
                    textAlign: "center",
                    padding: "12px 50px",
                    borderTop: "1px solid #f0f0f0",
                    background: "#fafafa",
                }}
            >
                Social Media Mini ©{new Date().getFullYear()} Created by
                @minhquan
            </Footer>
        </>
    );
};

export default MessagesFooter;
