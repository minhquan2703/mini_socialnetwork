"use client";
import React from "react";
import { Modal, Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useHasMounted } from "@/utils/customHook";

const ModalLoginRequire = (props: any) => {
    const { showModal, setShowModal } = props;
    const router = useRouter();
    const { Title, Text } = Typography;
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    return (
        <Modal
            open={showModal}
            footer={null}
            onCancel={()=>setShowModal(false)}
            maskClosable={false}
            centered
            width={360}
            styles={{
                body: {
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                    padding: 32,
                    textAlign: "center",
                },
            }}
        >
            <Title level={4} style={{ color: "#1a1a1a", marginBottom: 8 }}>
                Đăng nhập để tiếp tục
            </Title>
            <Text style={{ color: "#888", fontSize: 15 }}>
                Tính năng này yêu cầu tài khoản. Hãy đăng nhập để sử dụng.
            </Text>
            <div style={{ margin: "32px 0 0 0" }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<UserOutlined />}
                    style={{
                        background: "#222",
                        border: "none",
                        width: "100%",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        transition: "all .2s",
                    }}
                   href="/auth"
                >
                    Đăng nhập ngay
                </Button>
                <Button
                    type="text"
                    style={{
                        width: "100%",
                        marginTop: 16,
                        color: "#222",
                        background: "#f6f6f6",
                        borderRadius: 8,
                        fontWeight: 500,
                    }}
                    onClick={()=>setShowModal(false)}
                >
                    Để sau
                </Button>
            </div>
        </Modal>
    );
};

export default ModalLoginRequire;
