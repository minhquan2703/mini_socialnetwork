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

interface ModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalForgotPassword = (props: ModalProps) => {
    const [current, setCurrent] = useState<number>(0);
    const [userId, setUserId] = useState<string>("");
    const [emailLocal, setEmailLocal] = useState<string>("");
    const [form] = Form.useForm();
    const { isModalOpen, setIsModalOpen } = props;
    const hasMounted = useHasMounted();
    const handleResendCode = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths/resend-recover-password`,
            method: "POST",
            body: { email: emailLocal }
        })
        if (res?.data){
            toast.success(`Mã xác thực đã được gửi đến địa chỉ email: ${emailLocal}`)
        } else if(+res.statusCode === 429){
            toast.error('Vui lòng đợi 30 giây trước khi gửi lại mã xác thực')
        }
        else{
            toast.error('Lỗi không xác định, vui lòng thông báo cho quản trị viên :(')
        }
    }
    const onFinishStep0 = async (values: { email: string }) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths/resend-recover-password`,
            method: "POST",
            body: { email }
        });
        if (res?.data) {
            setUserId(res?.data?.id);
            setEmailLocal(email);
            setCurrent(1);
        } else if (+res.statusCode === 429) {
            toast.error("Vui lòng kiểm tra mục spam hoặc đợi 30 giây để gửi lại")
        } else if (res.message === "User was not found"){
            toast.error("Địa chỉ email không tồn tại trong hệ thống")
        }
        else {
            toast.error('Lỗi không xác định, vui lòng thông báo cho quản trị viên');
        }
    };
    const onFinishStep1 = async (values: {
        codeId: string;
        password: string;
        confirmPassword: string;
    }) => {
        const { codeId, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            toast.error('Mật khẩu nhập lại không trùng khớp')
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths/recover-password`,
            method: "POST",
            body: {
                codeId: codeId,
                id: userId,
                password: password,
            },
        });
        if (res?.data) {
            setCurrent(2);
        } else if (res.message === "Invalid codeId"){
            toast.error("Mã xác thực không hợp lệ");
        } else if (res.message === "Expired code"){
            toast.error("Mã xác thực đã hết hạn")
        }
        // else if(res.message === )
        
        else {
            toast.error("Lỗi không xác định, vui lòng thông báo cho quản trị viên");
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
                                    Gửi mã
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
                                        message: "Vui lòng nhập mã xác thực!",
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
                                        message: "Vui lòng nhập mật khẩu!",
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
                                        message: "Vui lòng nhập lại mật khẩu!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
                                    Xác nhận
                                </Button>
                                <Button type="dashed" onClick={() => handleResendCode()}>
                                    Gửi lại mã
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
                            Đóng
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
};
export default ModalForgotPassword;
