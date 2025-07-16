"use client";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Steps } from "antd";
import { useHasMounted } from "@/utils/customHook";
import {
    CheckCircleFilled,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { toast } from "sonner";

interface ModalProps{
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalForgotPassword = (props: ModalProps) => {
    const [current, setCurrent] = useState<number>(0);
    const [userId, setUserId] = useState<string>("");
    const [form] = Form.useForm();
    const { isModalOpen, setIsModalOpen } = props;
    const hasMounted = useHasMounted();
    const onFinishStep0 = async (values: {email: string;}) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<unknown>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/resend-recover-password`,
            method: "POST",
            body: {
                email,
            },
        });
        if (res?.data) {
            setUserId(res?.data?.id);
            setCurrent(1);
        } else {
            toast.error(res.message);
        }
    };
    const onFinishStep1 = async (values: any) => {
        const { codeId, password, confirmPassword } = values;
        const res = await sendRequest<IBackendRes<unknown>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
            method: "POST",
            body: {
                codeId: codeId,
                _id: userId,
                password: password,
                confirmPassword: confirmPassword,
            },
        });
        if (res?.data) {
            setCurrent(2);
        } else {
            toast.error(res.message);
        }
    };
    const resetModal = () => {
        if (current === 2) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(false);
            setCurrent(0);
        }
    };
    if (!hasMounted) return <></>;

    return (
        <>
            <Modal
                title="Quên mật khẩu"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={() => resetModal()}
                onCancel={() => resetModal()}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: "Email",
                            // status: "finish",
                            icon: <UserOutlined />,
                        },
                        {
                            title: "Xác thực",
                            // status: "finish",
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: "Thành công",
                            // status: "wait",
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 && (
                    <>
                        <div style={{ margin: "15px 0" }}>
                            Vui lòng điền địa chỉ email
                        </div>
                        <Form
                            name="verifystep0"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item label="" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Send code
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                {current === 1 && (
                    <>
                        <div style={{ margin: "15px 0" }}>
                            {/* Vui lòng kiểm tra email và nhập mã xác thực */}
                        </div>
                        <Form
                            name="verifystep1"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Mã xác thực"
                                name="codeId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your code!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input new password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Nhập lại mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                {current === 2 && (
                    <>
                        <div
                            style={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "10px",
                            }}
                        >
                            Khôi phục mật khẩu thành công
                            <CheckCircleFilled
                                style={{
                                    color: "#008eff",
                                    fontSize: "30px",
                                    margin: "10px auto 0 auto",
                                }}
                            />
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => resetModal()}
                        >
                            Close
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
};
export default ModalForgotPassword;
