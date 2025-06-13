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
                // marginLeft: '100px',
                marginTop: '60px',   // Space for fixed header
                minHeight: 'calc(100vh - 60px)',
                backgroundColor: '#f8f9fa'
            }}
        >
            <div
                style={{
                    padding: '30px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}
            >
                {children}
            </div>
        </Content>
    );
};

export default UserContent;
