"use client";
import { useEffect, useState } from "react";
import { Card, Avatar, Button, Input, Divider, Dropdown, Space } from "antd";
import {
    HeartOutlined,
    HeartFilled,
    CommentOutlined,
    ShareAltOutlined,
    MoreOutlined,
    PictureOutlined,
    SmileOutlined,
    SendOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { getAllPosts } from "@/services/post.service";
import { postToggleLike } from "@/services/like.service";
import LikeButton from "./user/like.button";

const HomePage = (props: any) => {
    const LIMIT = 10;
    const [current, setCurrent] = useState(1);
    const { session } = props;
    const [posts, setPosts] = useState([]);
    const [likeCount, setLikeCount] = "";

    const { TextArea } = Input;
    useEffect(() => {
        getDataPosts();
    }, [current]);
    const getDataPosts = async () => {
        const res = await getAllPosts({
            current: current,
            pageSize: LIMIT,
        });
        if (res && res?.data) {
            setPosts(res.data.results);
            console.log(" check res", res);
        }
        console.log("check post", posts);
    };
    const [newPost, setNewPost] = useState("");

    const handleLike = async (postId: string) => {
        try {
            const res = await postToggleLike({
                type: "post",
                postId: postId,
            });

            if (res && res.data) {
                setPosts((posts) =>
                    posts.map((post) => {
                        if (post.id !== postId) return post;
                        const isLiked = post.isLiked;
                        const likeCount = post.likeCount || 0;
                        return {
                            ...post,
                            isLiked: !isLiked,
                            likeCount: isLiked ? likeCount - 1 : likeCount + 1,
                        };
                    })
                );
            }
            console.log("check res toggle", res);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const moreActions: MenuProps["items"] = [
        { key: "1", label: "Lưu bài viết" },
        { key: "2", label: "Sao chép liên kết" },
        { type: "divider" },
        { key: "3", label: "Báo cáo", danger: true },
    ];

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            {/* Create Post Section */}
            <Card
                style={{
                    marginBottom: "24px",
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "none",
                }}
                styles={{ body: { padding: "20px" } }}
            >
                <div style={{ display: "flex", gap: "16px" }}>
                    <Avatar
                        size={48}
                        style={{
                            backgroundColor: "#000",
                            flexShrink: 0,
                            fontSize: "20px",
                        }}
                        src={session?.user?.image}
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
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                padding: "12px 0",
                                resize: "none",
                            }}
                        />
                        <Divider style={{ margin: "16px 0" }} />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Space size={24}>
                                <Button
                                    type="text"
                                    icon={<PictureOutlined />}
                                    style={{ color: "#666" }}
                                >
                                    Ảnh/Video
                                </Button>
                                <Button
                                    type="text"
                                    icon={<SmileOutlined />}
                                    style={{ color: "#666" }}
                                >
                                    Cảm xúc
                                </Button>
                                <Button
                                    type="text"
                                    icon={<GlobalOutlined />}
                                    style={{ color: "#666" }}
                                >
                                    Vị trí
                                </Button>
                            </Space>
                            <Button
                                color="default"
                                variant="solid"
                                icon={<SendOutlined />}
                                style={{
                                    fontWeight: "500",
                                    padding: "15px 20px",
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
                        marginBottom: "16px",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "none",
                    }}
                    styles={{
                        body: {
                            padding: "20px",
                        },
                    }}
                >
                    {/* Post Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "12px" }}>
                            <Avatar
                                size={42}
                                src={post.user.image}
                                style={{
                                    backgroundColor: "#000",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                {post.user.name.charAt(0) ||
                                    post.user.username.charAt(0)}
                            </Avatar>
                            <div>
                                <div
                                    style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#000",
                                        lineHeight: "20px",
                                    }}
                                >
                                    {post.user.name || post.user.username}
                                </div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: "#666",
                                        lineHeight: "18px",
                                    }}
                                >
                                    @{post.user.username}
                                    {/* · {post.timestamp} */}
                                </div>
                            </div>
                        </div>
                        <Dropdown
                            menu={{ items: moreActions }}
                            placement="bottomRight"
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                style={{ color: "#666", fontSize: "18px" }}
                            />
                        </Dropdown>
                    </div>

                    {/* Post Content */}
                    <p
                        style={{
                            fontSize: "15px",
                            lineHeight: "24px",
                            color: "#000",
                            marginBottom: "16px",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {post.content}
                    </p>

                    {/* Post Image */}
                    {/* {post.image && (
                        <div
                            style={{
                                marginBottom: "16px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            <Image
                                src={post.image}
                                alt="Post image"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                }}
                                preview={{
                                    mask: "Xem ảnh",
                                }}
                            />
                        </div>
                    )} */}

                    <Divider style={{ margin: "12px 0" }} />

                    {/* Post Stats */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            fontSize: "13px",
                            color: "#666",
                        }}
                    >
                        <span>1 bình luận</span>
                    </div>

                    <Divider style={{ margin: "8px 0" }} />

                    {/* Post Actions */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        {/* <Button
                            danger={post.isLiked}
                            icon={
                                post.isLiked ? (
                                    <HeartFilled />
                                ) : (
                                    <HeartOutlined />
                                )
                            }
                            onClick={() => handleLike(post.id)}
                            style={{
                                fontWeight: post.isLiked ? "600" : "400",
                                padding: "4px 12px",
                                height: "36px",
                                borderRadius: "8px",
                            }}
                        >
                            {post.likeCount}
                        </Button> */}
                        <LikeButton
                            isLiked={post.isLiked}
                            likeCount={post.likeCount}
                            onLike={() => handleLike(post.id)}
                        />

                        <Button
                            type="text"
                            icon={<CommentOutlined />}
                            style={{
                                color: "#666",
                                padding: "4px 12px",
                                height: "36px",
                                borderRadius: "8px",
                            }}
                        >
                            Bình luận
                        </Button>

                        <Button
                            type="text"
                            icon={<ShareAltOutlined />}
                            style={{
                                color: "#666",
                                padding: "4px 12px",
                                height: "36px",
                                borderRadius: "8px",
                            }}
                        >
                            Chia sẻ
                        </Button>
                    </div>
                </Card>
            ))}

            {/* Load More */}
            <div
                style={{
                    textAlign: "center",
                    padding: "24px 0 48px",
                }}
            >
                <Button
                    type="default"
                    style={{
                        borderRadius: "8px",
                        height: "40px",
                        paddingLeft: "32px",
                        paddingRight: "32px",
                        fontWeight: "500",
                    }}
                >
                    Xem thêm bài viết
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
