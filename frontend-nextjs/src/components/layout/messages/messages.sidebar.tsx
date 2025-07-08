'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    MailOutlined,
    SettingOutlined,
    TeamOutlined,
    ArrowLeftOutlined,
    MessageOutlined,
    UserOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { MessagesContext } from "@/library/user.messages.context";
import { Button, Input, Avatar, Badge, Space } from "antd";

type MenuItem = Required<MenuProps>['items'][number];

const MessagesSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(MessagesContext)!;
    const [searchValue, setSearchValue] = useState('');

    // Recent chats data với avatar và status
    const recentChats = [
        {
            key: "chat-1",
            name: "Nguyễn Văn A",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
            lastMessage: "Ok bạn nhé",
            time: "2 phút",
            unread: 3,
            online: true,
        },
        {
            key: "chat-2",
            name: "Trần Thị B",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
            lastMessage: "Hẹn gặp lại",
            time: "1 giờ",
            unread: 0,
            online: false,
        },
        {
            key: "chat-3",
            name: "Nhóm Dự án X",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DX",
            lastMessage: "File đã được cập nhật",
            time: "3 giờ",
            unread: 12,
            isGroup: true,
        },
    ];

    const menuItems: MenuItem[] = [
        {
            key: "all-messages",
            label: <Link href="/messages">Tất cả</Link>,
            icon: <MessageOutlined />,
        },
        {
            key: "contacts",
            label: <Link href="/messages/contacts">Danh bạ</Link>,
            icon: <UserOutlined />,
        },
        {
            key: "groups",
            label: <Link href="/messages/groups">Nhóm</Link>,
            icon: <TeamOutlined />,
        },
        {
            key: "archived",
            label: <Link href="/messages/archived">Lưu trữ</Link>,
            icon: <MailOutlined />,
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
            }}
            width={320}
            collapsedWidth={80}
        >
            {/* Header */}
            <div style={{ 
                padding: collapseMenu ? '20px 16px' : '20px',
                borderBottom: '1px solid #f0f0f0',
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: collapseMenu ? 0 : 16,
                }}>
                    <Link href="/">
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />}
                            style={{ padding: '4px 8px' }}
                        />
                    </Link>
                    
                    {!collapseMenu && (
                        <>
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '20px',
                                fontWeight: 600,
                                flex: 1,
                                textAlign: 'center',
                            }}>
                                Tin nhắn
                            </h2>
                            
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                shape="circle"
                                size="small"
                            />
                        </>
                    )}
                </div>

                {/* Search Bar */}
                {!collapseMenu && (
                    <Input
                        placeholder="Tìm kiếm tin nhắn..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#f5f5f5',
                            border: 'none',
                        }}
                    />
                )}
            </div>

            {/* Navigation Menu */}
            <div style={{ 
                padding: collapseMenu ? '8px 0' : '12px 0',
                borderBottom: '1px solid #f0f0f0',
            }}>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['all-messages']}
                    items={menuItems}
                    style={{ 
                        border: 'none',
                        justifyContent: collapseMenu ? 'center' : 'space-around',
                        minHeight: 'auto',
                    }}
                />
            </div>

            {/* Recent Chats */}
            <div style={{ 
                flex: 1,
                overflowY: 'auto',
                padding: collapseMenu ? '8px' : '12px',
            }}>
                {!collapseMenu && (
                    <div style={{ 
                        fontSize: '13px',
                        color: '#8c8c8c',
                        marginBottom: '12px',
                        paddingLeft: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}>
                        <ClockCircleOutlined />
                        Gần đây
                    </div>
                )}

                {recentChats.map((chat) => (
                    <Link 
                        key={chat.key} 
                        href={`/messages/${chat.key}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: collapseMenu ? '12px 8px' : '12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '4px',
                            backgroundColor: chat.unread > 0 ? '#f6f8fa' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f2f5';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = chat.unread > 0 ? '#f6f8fa' : 'transparent';
                        }}>
                            <Badge 
                                dot={chat.online && !chat.isGroup}
                                status="success"
                                offset={[-4, 36]}
                            >
                                <Avatar 
                                    src={chat.avatar}
                                    size={collapseMenu ? 36 : 48}
                                    style={{ 
                                        backgroundColor: chat.isGroup ? '#722ed1' : '#1890ff',
                                    }}
                                >
                                    {chat.name.charAt(0)}
                                </Avatar>
                            </Badge>

                            {!collapseMenu && (
                                <div style={{ 
                                    flex: 1,
                                    marginLeft: '12px',
                                    minWidth: 0,
                                }}>
                                    <div style={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '4px',
                                    }}>
                                        <span style={{ 
                                            fontWeight: chat.unread > 0 ? 600 : 400,
                                            fontSize: '15px',
                                            color: '#262626',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {chat.name}
                                        </span>
                                        <span style={{ 
                                            fontSize: '12px',
                                            color: chat.unread > 0 ? '#1890ff' : '#8c8c8c',
                                            flexShrink: 0,
                                        }}>
                                            {chat.time}
                                        </span>
                                    </div>
                                    <div style={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{ 
                                            fontSize: '14px',
                                            color: chat.unread > 0 ? '#262626' : '#8c8c8c',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: chat.unread > 0 ? 500 : 400,
                                        }}>
                                            {chat.lastMessage}
                                        </span>
                                        {chat.unread > 0 && (
                                            <Badge 
                                                count={chat.unread}
                                                style={{ 
                                                    backgroundColor: '#1890ff',
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Settings */}
            <div style={{ 
                borderTop: '1px solid #f0f0f0',
                padding: collapseMenu ? '12px' : '16px',
            }}>
                <Link href="/messages/settings">
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        block
                        style={{
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: collapseMenu ? 'center' : 'flex-start',
                        }}
                    >
                        {!collapseMenu && "Cài đặt"}
                    </Button>
                </Link>
            </div>
        </Sider>
    )
}

export default MessagesSideBar;