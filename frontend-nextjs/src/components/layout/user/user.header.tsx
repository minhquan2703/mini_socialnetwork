// 'use client'
// import { SearchOutlined, BellOutlined, BellFilled } from "@ant-design/icons";
// import { Input, Layout, Avatar, Dropdown, Badge } from "antd";
// import type { MenuProps } from "antd";
// import { signOut } from "next-auth/react";

// const UserHeader = (props: any) => {
//     const { session } = props;
//     const { Header } = Layout;

//     const dropdownItems: MenuProps["items"] = [
//         {
//             key: "profile",
//             label: "Trang cá nhân",
//         },
//         {
//             key: "settings",
//             label: "Thông tin tài khoản",
//         },
//         {
//             type: "divider",
//         },
//         {
//             key: "logout",
//             danger: true,
//             label: "Đăng xuất",
//             onClick: () => signOut(),
//         },
//     ];
//     return (
//         <Header
//             style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: '220px',
//                 right: 0,
//                 height: '70px',
//                 background: '#ffffff',
//                 borderBottom: '1px solid #f0f0f0',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 padding: '0 30px',
//                 zIndex: 99,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
//             }}
//         >
//             {/*logo*/}
//             <div style={{ 
//                 fontSize: '24px', 
//                 fontWeight: '700', 
//                 letterSpacing: '-0.5px'
//             }}>
//                 Social
//             </div>
//             {/*seaching */}
//             <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px' }}>
//                 <Input
//                     placeholder="Tìm kiếm..."
//                     prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
//                     style={{
//                         borderRadius: '24px',
//                         backgroundColor: '#f5f5f5',
//                         border: '1px solid #e8e8e8',
//                         padding: '8px 16px',
//                         fontSize: '14px'
//                     }}
//                 />
//             </div>

//             {/*RIGHT SIDE*/}
//             <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '20px', 
//             }}>
//                 {/*notifications*/}
//                 <div style={{backgroundColor: '#f5f5f5', transition: "background 0.4s", borderRadius: "50px", width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center"}}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 >
//                 <Badge count={5} size="small">
//                     <BellFilled 
//                         style={{
//                             fontSize: '20px', 
//                             color: 'black',
//                             cursor: 'pointer'
//                         }} 
//                     />
//                 </Badge>
//                 </div>
//                 {/*user dropdown */}
//                 <Dropdown 
//                     menu={{ items: dropdownItems }} 
//                     placement="bottomRight"
//                     trigger={['click']}
//                 >
//                     <div style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: "center",
//                         height: "45px",
//                         width: "45px",
//                         cursor: 'pointer',
//                         padding: '5px 5px',
//                         borderRadius: '50px',
//                         transition: 'background-color 0.4s'
//                     }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                     >
//                         <Avatar 
//                             size={36} 
//                             src={session?.user?.image}
//                             style={{ backgroundColor: '#1890ff' }}
//                         >
//                             {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.username?.charAt(0).toUpperCase() }
//                         </Avatar>
//                     </div>
//                 </Dropdown>
//             </div>
//         </Header>
//     );
// };

// export default UserHeader;


'use client'
import { SearchOutlined, BellOutlined, BellFilled } from "@ant-design/icons";
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
                position: 'fixed',
                top: 0,
                left: '220px',
                right: 0,
                height: '64px',
                background: '#ffffff',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                zIndex: 99
            }}
        >
            {/* Logo */}
            <div style={{ 
                fontSize: '22px', 
                fontWeight: '700', 
                letterSpacing: '-0.5px',
                color: '#000'
            }}>
                Social
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '420px', margin: '0 48px' }}>
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    size="large"
                    style={{
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                        borderColor: '#f0f0f0'
                    }}
                    styles={{
                        input: {
                            fontSize: '14px',
                            color: '#000'
                        },
                        prefix: {
                            color: '#999'
                        }
                    }}
                />
            </div>

            {/* Right Section */}
            <Space size={12}>
                {/* Notifications */}
                <Button
                    type="text"
                    shape="circle"
                    size="large"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    icon={
                        <Badge count={5} size="small" color="#000">
                            <BellFilled style={{ fontSize: '20px', color: '#333' }} />
                        </Badge>
                    }
                />

                {/* User Dropdown */}
                <Dropdown 
                    menu={{ items: dropdownItems }} 
                    placement="bottomRight"
                    trigger={['click']}
                    dropdownRender={(menu) => (
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #f0f0f0'
                        }}>
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
                            width: '40px',
                            height: '40px'
                        }}
                        icon={
                            <Avatar 
                                size={36} 
                                src={session?.user?.image}
                                style={{ 
                                    backgroundColor: '#000',
                                    border: '1px solid #f0f0f0',
                                    color: '#fff'
                                }}
                            >
                                {session?.user?.name?.charAt(0).toUpperCase() || 
                                 session?.user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                    />
                </Dropdown>
            </Space>
        </Header>
    );
};

export default UserHeader;