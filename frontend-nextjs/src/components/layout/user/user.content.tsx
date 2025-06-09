'use client'

import { Layout } from "antd";

const UserContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content
            style={{
                marginLeft: '200px',
                marginTop: '70px',   // Space for fixed header
                minHeight: 'calc(100vh - 70px)',
                // backgroundColor: '#f8f9fa'
            }}
        >
            <div
                style={{
                    padding: '30px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                {children}
            </div>
        </Content>
    );
};

export default UserContent;
