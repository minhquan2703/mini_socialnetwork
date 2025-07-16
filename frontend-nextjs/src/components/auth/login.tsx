"use client";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authenticate } from "@/utils/action";
import { useState } from "react";
import ModalForgotPassword from "./modal.forgotpass";
import { toast } from "sonner";
import ModalActive from "./modal.active";

interface modalLogin {
    username: string;
    password: string
}

const Login = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalForgotPasswordOpen, setIsModalForgotPasswordOpen] =
        useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [usernameModal, setUsernameModal] = useState("");
    const onFinish = async (values: modalLogin) => {
        const { username, password } = values;
        setUserEmail("");
        setUsernameModal("");
        await toast.promise(
            authenticate(username, password).then((res) => {
                if (res.error && +res.code === 2) {
                    setIsModalOpen(true);
                    setUsernameModal(username);
                    setUserEmail(username);
                    throw new Error(res.error);
                }
                if (res.error) {
                    throw new Error(res.error);
                }
                setTimeout(async () => {
                    try {
                        const response = await fetch("/api/auth/session");
                        const session = await response.json();
                        if (session?.user?.role === "ADMIN") {
                            window.location.href = "/dashboard";
                        } else {
                            window.location.href = "/";
                        }
                    } catch (error) {
                        console.error("Error getting session:", error);
                        window.location.href = "/";
                    }
                }, 1000);
            }),

            {
                loading: "Vui lòng đợi...",
                success: "Đăng nhập thành công!",
                error: (err) => err.message || "Lỗi đăng nhập",
            }
        );
    };


    return (
        <>
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={21} md={14} lg={7}>
                    <fieldset
                        style={{
                            padding: "15px",
                            margin: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    >
                        <legend style={{ fontSize: "18px", fontWeight: "600" }}>
                            Đăng Nhập
                        </legend>
                        <Form
                            size="large"
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label=""
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên tài khoản!",
                                    },
                                ]}
                            >
                                <Input placeholder="Tên tài khoản" />
                            </Form.Item>

                            <Form.Item
                                label=""
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>
                            <div style={{ display: "flex" }}>
                                <Form.Item>
                                    <Button
                                        color="default"
                                        variant="solid"
                                        htmlType="submit"
                                        size="middle"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Button
                                    color="primary"
                                    variant="text"
                                    size="middle"
                                    onClick={() =>
                                        setIsModalForgotPasswordOpen(true)
                                    }
                                    style={{ marginLeft: "auto" }}
                                >
                                    Quên mật khẩu
                                </Button>
                            </div>
                        </Form>
                        <Link href={"/"}>
                            <ArrowLeftOutlined /> Quay lại trang chủ
                        </Link>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Chưa có tài khoản?{" "}
                            <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                        </div>
                    </fieldset>
                </Col>
            </Row>
            <ModalActive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
                usernameModal={usernameModal}
            />
            <ModalForgotPassword
                isModalOpen={isModalForgotPasswordOpen}
                setIsModalOpen={setIsModalForgotPasswordOpen}
            />
        </>
    );
};

export default Login;
