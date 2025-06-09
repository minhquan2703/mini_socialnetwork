"use client";
import React from "react";
import { Button, Col, Divider, Form, Input, Row, Card } from "antd";
import { CheckCircleFilled, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IVerifyAccount } from "@/types/auth.type";
import { postAuthVerifyAccount } from "@/services/auth.service";
import { toast } from "sonner";

const Verify = ({ id }: { id: string }) => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const payload: IVerifyAccount = {
            id: values.id,
            code: values.code.trim(),
        };
        const res = await postAuthVerifyAccount(payload);
        if (+res?.statusCode === 500){
            toast.error('Tài khoản không tồn tại hoặc đã bị xoá, vui lòng đăng ký lại')
            router.push(`/auth/register`);
            return;
        }
        if (res?.data && +res?.statusCode === 201) {
            toast.success("Xác thực thành công 🎉");
            router.push(`/auth/login`);
        } else {
            toast.error(res.message);
        }

        console.log('check res', res)
    };

    return (
        <Row justify="center" style={{ marginTop: 48 }}>
            <Col xs={24} sm={16} md={10} lg={7} xl={6}>
                <Card
                    style={{
                        borderRadius: 14,
                        boxShadow: "0 2px 16px #2221",
                        border: "1px solid #eee",
                    }}
                >
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            textAlign: "center",
                            marginBottom: 8,
                        }}
                    >
                        Xác thực tài khoản
                    </div>
                    <div
                        style={{
                            background: "#fafafa",
                            border: "1px solid #2222",
                            borderRadius: 8,
                            padding: "10px 13px",
                            margin: "0 0 20px 0",
                            fontSize: "14px",
                        }}
                    >
                        Đã gửi mã xác thực đến địa chỉ email đăng ký, hãy kiểm tra trong mục <b>Spam</b> hoặc <b>Quảng cáo</b> nếu không thấy email.
                        Tài khoản <b>sẽ bị xoá sau 10 phút</b> nếu không được xác thực. 
                    </div>
                    <Form
                        layout="vertical"
                        size="large"
                        onFinish={onFinish}
                        autoComplete="off"
                        initialValues={{ id }}
                    >
                        <Form.Item name="id" initialValue={id} hidden>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label=""
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mã xác thực",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập mã xác thực..."
                                style={{
                                    background: "#fff",
                                    borderColor: "#222",
                                    color: "#111",
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button color="default" htmlType="submit" size="middle" variant="solid">
                                Xác thực
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        <Link href="/" style={{ color: "#222" }}>
                            <ArrowLeftOutlined /> Quay lại trang chủ
                        </Link>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        Đã có tài khoản?{" "}
                        <Link
                            href="/auth/login"
                            style={{ color: "#111", fontWeight: 500 }}
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default Verify;
