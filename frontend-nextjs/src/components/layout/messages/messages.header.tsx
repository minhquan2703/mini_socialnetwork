'use client'
import { Button, Layout } from "antd";
import { useContext } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { signOut } from "next-auth/react";
import { MessagesContext } from "@/library/user.messages.context";
const MessagesHeader = (props: any) => {
    const { session } = props;
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(MessagesContext)!;

    // const { data: session, status } = useSession();
    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <span>
                    Cài đặt
                </span>
            ),
        },

        {
            key: "4",
            danger: true,
            label: <span>Đăng xuất</span>,
            onClick: () => signOut(),
        },
    ];

    return (
        <>
            <Header
                style={{
                    fontFamily: "sans-serif",
                    height: "55px",
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* <Button
                    type="text"
                    icon={
                        collapseMenu ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: "16px",
                        width: "55px",
                        height: "100%"
                    }}
                /> */}
                <div className="logo" style={{fontSize: "20px", paddingLeft: "20px", fontWeight: "700"}}>
                    Logo Social Media mini 
                </div>
                <Dropdown menu={{ items }}>
                    <a
                        onClick={(e) => e.preventDefault()}
                        style={{
                            color: "unset",
                            lineHeight: "0 !important",
                            marginRight: 20,
                        }}
                    >
                        <Space>
                            Welcome {session?.user?.name || session?.user?.username}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    );
};

export default MessagesHeader;
