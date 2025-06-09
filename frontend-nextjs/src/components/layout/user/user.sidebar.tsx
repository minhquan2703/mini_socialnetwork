// "use client";
// import Layout from "antd/es/layout";
// import Menu from "antd/es/menu";
// import {
//     HomeFilled,
//     MessageOutlined,
//     TeamOutlined,
//     SettingOutlined,
//     WhatsAppOutlined,
//     FacebookFilled,
//     LinkedinFilled,
//     GoogleCircleFilled,
//     AppstoreOutlined,
// } from "@ant-design/icons";
// import React from "react";
// import type { MenuProps } from "antd";
// import Link from "next/link";
// import { Avatar, Badge } from "antd";

// type MenuItem = Required<MenuProps>["items"][number];

// const UserSideBar = (props: any) => {
//     const { session } = props;
//     const { Sider } = Layout;

//     const items: MenuItem[] = [

//         {
//             key: 'grp',
//             type: 'group',
//             children: [
//                 {
//                     key: "home",
//                     label: <Link href={"/"}>Trang chủ</Link>,
//                     icon: <HomeFilled style={{ fontSize: "16px" }}/>,
//                 },
//                 {
//                     key: "messages",
//                     label: 
//                     <Link href={"/"}>
//                         <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", }}>
//                             Tin nhắn <Badge count={3} size="small" style={{background: "#ff4d4f"}}/>
//                         </div>
//                     </Link>,
//                     icon: <MessageOutlined style={{ fontSize: "16px" }} />,
//                 },
//                 {
//                     key: "friends",
//                     label: <Link href={"/"}>Bạn bè</Link>,
//                     icon: <TeamOutlined style={{ fontSize: "16px" }}/>,
//                 },
//                 {
//                     key: 'stories',
//                     label: 'Bảng tin',
//                     icon: <AppstoreOutlined style={{ fontSize: "16px" }}/>,
//                     children: [
//                         { key: '5', label: 'Tin của bạn' },
//                         { key: '6', label: 'Kho lưu trữ' },
//                     ],
//                 },
//                 {
//                     key: "settings",
//                     label: <Link href={"/"}>Cài đặt</Link>,
//                     icon: <SettingOutlined style={{ fontSize: "16px" }}/>,
//                 },                  
//                 {
//                     type: 'divider',
//                 },
//                 {
//                     key: 'contact',
//                     label: 'Liên hệ với tôi',
//                     icon: <WhatsAppOutlined style={{ fontSize: "16px" }}/>,
//                     children: [
//                         { key: '9', label: 'Facebook', icon: <FacebookFilled /> },
//                         { key: '10', label: 'Linkedin', icon: <LinkedinFilled /> },
//                         { key: '11', label: 'Email', icon: <GoogleCircleFilled /> },
//                     ],
//                 },
//             ],
//         },
//     ]
//     return (
//         <div
//             style={{
//                 width: "200px",
//                 height: "100vh",
//                 borderRight: "1px solid #f0f0f0",
//                 padding: "20px 10px",
//                 position: "fixed",
//                 left: 0,
//                 top: 0,
//                 zIndex: 100,
//             }}
//         >
//             {/* User Profile Section */}
//             <div
//                 style={{
//                     padding: "0 20px 30px 20px",
//                     borderBottom: "1px solid #f0f0f0",
//                     marginBottom: "5px",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                     }}
//                 >
//                     <Avatar
//                         size={40}
//                         src={session?.user?.image}
//                         style={{ backgroundColor: "#1890ff" }}
//                     >
//                         {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.username?.charAt(0).toUpperCase()}
//                     </Avatar>
//                     <div>
//                         <div
//                             style={{ fontSize: "16px", fontWeight: "600", marginBottom: "2px" }}>
//                             {session?.user?.name || "Khách tới chơi"}
//                         </div>
//                         <div style={{fontSize: "12px", color: "#8c8c8c",}}>
//                             @{session?.user?.username}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Menu
//                 mode="inline"
//                 defaultSelectedKeys={["home"]}
//                 items={items}
//                 style={{ fontSize: "15px", border: "none" }}
//             />
//         </div>
//     );
// };

// export default UserSideBar;


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
} from "@ant-design/icons";
import React from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { Avatar, Badge, Card } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const UserSideBar = (props: any) => {
    const { session } = props;
    const { Sider } = Layout;

    const items: MenuItem[] = [
        {
            key: 'grp',
            type: 'group',
            children: [
                {
                    key: "home",
                    label: <Link href={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>,
                    icon: <HomeFilled />,
                },
                {
                    key: "messages",
                    label: (
                        <Link href={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                Tin nhắn 
                                <Badge 
                                    count={3} 
                                    size="small" 
                                    color="#000"
                                    styles={{
                                        indicator: {
                                            fontSize: '10px'
                                        }
                                    }}
                                />
                            </div>
                        </Link>
                    ),
                    icon: <MessageOutlined />,
                },
                {
                    key: "friends",
                    label: <Link href={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>Bạn bè</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: 'stories',
                    label: 'Bảng tin',
                    icon: <AppstoreOutlined />,
                    children: [
                        { key: '5', label: 'Tin của bạn' },
                        { key: '6', label: 'Kho lưu trữ' },
                    ],
                },
                {
                    key: "settings",
                    label: <Link href={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>Cài đặt</Link>,
                    icon: <SettingOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: 'contact',
                    label: 'Liên hệ với tôi',
                    icon: <WhatsAppOutlined />,
                    children: [
                        { key: '9', label: 'Facebook', icon: <FacebookFilled /> },
                        { key: '10', label: 'Linkedin', icon: <LinkedinFilled /> },
                        { key: '11', label: 'Email', icon: <GoogleCircleFilled /> },
                    ],
                },
            ],
        },
    ];

    return (
        <Sider
            width={220}
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                zIndex: 100,
            }}
        >
            {/* User Profile Section */}
            <Card
                bordered={false}
                bodyStyle={{
                    padding: '24px 16px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Avatar
                        size={44}
                        src={session?.user?.image}
                        style={{ 
                            backgroundColor: "#000",
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}
                    >
                        {session?.user?.name?.charAt(0).toUpperCase() || 
                         session?.user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ 
                            fontSize: "15px", 
                            fontWeight: "600", 
                            color: '#000',
                            marginBottom: "2px",
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {session?.user?.name || "Khách tới chơi"}
                        </div>
                        <div style={{ 
                            fontSize: "13px", 
                            color: "#666",
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            @{session?.user?.username}
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
                    borderRight: 'none',
                    marginTop: '8px'
                }}
                styles={{
                    item: {
                        marginBlock: 4,
                        marginInline: 8,
                        borderRadius: 8,
                        fontSize: '14px',
                        height: 42
                    },
                    subMenuItem: {
                        marginBlock: 4,
                        marginInline: 8,
                        borderRadius: 8,
                        fontSize: '14px'
                    },
                    icon: {
                        fontSize: '16px'
                    },
                    itemIcon: {
                        color: '#666'
                    },
                    itemText: {
                        color: '#333'
                    },
                    itemSelectedBg: '#f5f5f5',
                    itemSelectedColor: '#000',
                    itemHoverBg: '#fafafa',
                    itemHoverColor: '#000',
                    itemActiveBg: '#f0f0f0',
                    subMenuItemBg: 'transparent',
                    horizontalItemHoverBg: '#fafafa',
                    horizontalItemSelectedBg: '#f5f5f5',
                    horizontalItemSelectedColor: '#000'
                }}
            />
        </Sider>
    );
};

export default UserSideBar;