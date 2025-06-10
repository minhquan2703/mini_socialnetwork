"use client";
import React from "react";
import { Button, Col, Divider, Flex, Form, Input, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IRegister } from "@/types/auth.type";
import { postAuthRegister } from "@/services/auth.service";

const Register = () => {
    const router = useRouter();
    const onFinish = async (values: IRegister) => {
        const res = await postAuthRegister(values);
        if (res?.data) {
            toast.success("Đăng ký thành công!");
            router.push(`/verify/${res?.data?.id}`);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={18} md={12} lg={6}>
                <fieldset
                    style={{
                        padding: "20px",
                        margin: "5px",
                        border: "1px solid #222",
                        borderRadius: "5px",
                    }}
                >
                    <legend style={{fontSize: "15px", fontWeight: "600"}}>Đăng Ký Tài Khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item label="" name="name">
                            <Input placeholder="Tên người dùng"/>
                        </Form.Item>
                        <Form.Item
                            label=""
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                            ]}
                        >
                            <Input placeholder="Địa chỉ email"/>
                        </Form.Item>
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
                            <Input.Password placeholder="Mật khẩu"/>
                        </Form.Item>
                        <Form.Item>
                            <Button color="default" variant="solid" htmlType="submit">
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/"}>
                        <ArrowLeftOutlined/> Quay lại trang chủ
                    </Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản?{" "}
                        <Link href={"/auth"}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default Register;
