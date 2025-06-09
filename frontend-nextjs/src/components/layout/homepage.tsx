'use client'
import { useState } from 'react';
import { Card, Avatar, Button, Input, Divider, Image, Dropdown, Space } from 'antd';
import { 
    HeartOutlined, 
    HeartFilled, 
    CommentOutlined, 
    ShareAltOutlined,
    MoreOutlined,
    PictureOutlined,
    SmileOutlined,
    SendOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { TextArea } = Input;

interface Post {
    id: number;
    author: {
        name: string;
        username: string;
        avatar?: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    timestamp: string;
}

const HomePage = (props: any) => {
    const { session } = props
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            author: {
                name: "Nguyễn Văn A",
                username: "nguyenvana",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            content: "Buổi sáng tuyệt vời để bắt đầu một ngày mới! Chúc mọi người một ngày làm việc hiệu quả 🌅",
            image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop",
            likes: 42,
            comments: 8,
            shares: 2,
            liked: false,
            timestamp: "2 giờ trước"
        },
        {
            id: 2,
            author: {
                name: "Trần Thị B",
                username: "tranthib",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            content: "Code không bug từ lần đầu tiên - cảm giác này thật tuyệt vời! 💻✨ #DevLife #Coding",
            likes: 128,
            comments: 23,
            shares: 5,
            liked: true,
            timestamp: "5 giờ trước"
        },
        {
            id: 3,
            author: {
                name: "Lê Minh C",
                username: "leminhc",
                avatar: "https://randomuser.me/api/portraits/men/3.jpg"
            },
            content: "Vừa hoàn thành dự án sau 3 tháng làm việc chăm chỉ. Cảm ơn team đã cùng nhau cố gắng! 🎉",
            likes: 256,
            comments: 45,
            shares: 12,
            liked: false,
            timestamp: "1 ngày trước"
        }
    ]);

    const [newPost, setNewPost] = useState('');

    const handleLike = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const moreActions: MenuProps['items'] = [
        { key: '1', label: 'Lưu bài viết' },
        { key: '2', label: 'Sao chép liên kết' },
        { type: 'divider' },
        { key: '3', label: 'Báo cáo', danger: true },
    ];

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Create Post Section */}
            <Card 
                style={{ 
                    marginBottom: '24px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: 'none'
                }}
                bodyStyle={{ padding: '20px' }}
            >
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar 
                        size={48} 
                        style={{ 
                            backgroundColor: '#000',
                            flexShrink: 0,
                            fontSize: '20px'
                        }}
                    >
                        {session?.user?.name?.charAt(0).toUpperCase() || 
                         session?.user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                        <TextArea
                            placeholder="Bạn đang nghĩ gì?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 5 }}
                            style={{
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                padding: '12px 0',
                                resize: "none",
                            }}
                        />
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <Space size={24}>
                                <Button 
                                    type="text" 
                                    icon={<PictureOutlined />}
                                    style={{ color: '#666' }}
                                >
                                    Ảnh/Video
                                </Button>
                                <Button 
                                    type="text" 
                                    icon={<SmileOutlined />}
                                    style={{ color: '#666' }}
                                >
                                    Cảm xúc
                                </Button>
                                <Button 
                                    type="text" 
                                    icon={<GlobalOutlined />}
                                    style={{ color: '#666' }}
                                >
                                    Vị trí
                                </Button>
                            </Space>
                            <Button 
                                color="default"
                                variant="solid"
                                icon={<SendOutlined />}
                                style={{
                                    fontWeight: '500',
                                    padding: "15px 20px"
                                }}
                                disabled={!newPost.trim()}
                            >
                                Đăng
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
                <Card 
                    key={post.id}
                    style={{ 
                        marginBottom: '16px',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        boxShadow: 'none'
                    }}
                    bodyStyle={{ padding: '20px' }}
                >
                    {/* Post Header */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Avatar 
                                size={42} 
                                src={post.author.avatar}
                                style={{ 
                                    backgroundColor: '#000',
                                    border: '1px solid #f0f0f0'
                                }}
                            >
                                {post.author.name.charAt(0)}
                            </Avatar>
                            <div>
                                <div style={{ 
                                    fontSize: '15px', 
                                    fontWeight: '600',
                                    color: '#000',
                                    lineHeight: '20px'
                                }}>
                                    {post.author.name}
                                </div>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#666',
                                    lineHeight: '18px'
                                }}>
                                    @{post.author.username} · {post.timestamp}
                                </div>
                            </div>
                        </div>
                        <Dropdown menu={{ items: moreActions }} placement="bottomRight">
                            <Button 
                                type="text" 
                                icon={<MoreOutlined />}
                                style={{ color: '#666', fontSize: "18px" }}
                            />
                        </Dropdown>
                    </div>

                    {/* Post Content */}
                    <p style={{ 
                        fontSize: '15px', 
                        lineHeight: '24px',
                        color: '#000',
                        marginBottom: '16px',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {post.content}
                    </p>

                    {/* Post Image */}
                    {post.image && (
                        <div style={{ 
                            marginBottom: '16px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5'
                        }}>
                            <Image
                                src={post.image}
                                alt="Post image"
                                style={{ 
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                                preview={{
                                    mask: 'Xem ảnh'
                                }}
                            />
                        </div>
                    )}

                    <Divider style={{ margin: '12px 0' }} />

                    {/* Post Stats */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        fontSize: '13px',
                        color: '#666'
                    }}>
                        <span>{post.likes} lượt thích</span>
                        <span>{post.comments} bình luận · {post.shares} chia sẻ</span>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* Post Actions */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-around'
                    }}>
                        <Button 
                            type="text"
                            icon={post.liked ? <HeartFilled /> : <HeartOutlined />}
                            onClick={() => handleLike(post.id)}
                            style={{ 
                                color: post.liked ? '#000' : '#666',
                                fontWeight: post.liked ? '600' : '400',
                                padding: '4px 12px',
                                height: '36px',
                                borderRadius: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            Thích
                        </Button>
                        
                        <Button 
                            type="text"
                            icon={<CommentOutlined />}
                            style={{ 
                                color: '#666',
                                padding: '4px 12px',
                                height: '36px',
                                borderRadius: '8px'
                            }}
                        >
                            Bình luận
                        </Button>
                        
                        <Button 
                            type="text"
                            icon={<ShareAltOutlined />}
                            style={{ 
                                color: '#666',
                                padding: '4px 12px',
                                height: '36px',
                                borderRadius: '8px'
                            }}
                        >
                            Chia sẻ
                        </Button>
                    </div>
                </Card>
            ))}

            {/* Load More */}
            <div style={{ 
                textAlign: 'center', 
                padding: '24px 0 48px',
            }}>
                <Button
                    type="default"
                    style={{
                        borderRadius: '8px',
                        height: '40px',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        fontWeight: '500'
                    }}
                >
                    Xem thêm bài viết
                </Button>
            </div>
        </div>
    );
};

export default HomePage;