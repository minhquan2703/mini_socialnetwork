import { postNewOne } from "@/services/post.service";
import {
    GlobalOutlined,
    PictureOutlined,
    SendOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Input, Space } from "antd";
import { useState } from "react";

const CreatePostForm = ({ session }) => {
    const { TextArea } = Input;
    const [newPost, setNewPost] = useState("");
    const handleSubmit = async() =>{
        const res = await postNewOne({content: newPost})
        console.log('check res', res)
    }
    return (
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
                        backgroundColor: `${session?.user?.avatarColor}`,
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
                            onClick={()=>handleSubmit()}
                        >
                            Đăng
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export default CreatePostForm;
