"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Steps } from "antd";
import { useHasMounted } from "@/utils/customHook";
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { postAuthVerifyAccount, postResendCode } from "@/services/auth.service";
import { IResendCode, IVerifyAccount } from "@/types/auth.type";
interface PropsModalActive {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userEmail: string;
    usernameModal: string;
}

const ModalActive = (props: PropsModalActive) => {
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [form] = Form.useForm();
    const { isModalOpen, setIsModalOpen, userEmail, usernameModal } = props;
    const hasMounted = useHasMounted();
    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("username", usernameModal);
        }
    }, [usernameModal, userEmail, form]);

    const onFinishStep0 = async (values: IResendCode) => {
        setIsSending(true);
        const res = await postResendCode(values);
        if (res?.data) {
            setUserId(res?.data?.id);
            setCurrent(1);
        } else if (+res.statusCode === 429) {
            toast.error(res.message);
        } else if (res.message === "Invalid email") {
            toast.error("Địa chỉ email không hợp lệ");
        } else {
            toast.error(
                "Lỗi không xác định, vui lòng thông báo cho quản trị viên"
            );
        }
        setIsSending(false);
    };
    const onFinishStep1 = async (values: IVerifyAccount) => {
        const { code } = values;
        const payload: IVerifyAccount = {
            id: userId,
            code: code.trim(),
        };
        const res = await postAuthVerifyAccount(payload);
        if (res?.data) {
            setCurrent(2);
        } else if (res.message === "Invalid code") {
            toast.error("Mã xác thực không hợp lệ");
        } else {
            toast.error(
                "Lỗi không xác định, vui lòng thông báo cho quản trị viên"
            );
        }
    };
    const resetModal = () => {
        setIsModalOpen(false);
        setCurrent(0);
    };
    if (!hasMounted) return <></>;

    return (
        <>
            <Modal
                title="Kích hoạt tài khoản"
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
                            title: "Thông tin",
                            // status: "finish",
                            icon: <UserOutlined />,
                        },
                        {
                            title: "Xác thực",
                            // status: "finish",
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: "Hoàn thành",
                            // status: "wait",
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 && (
                    <>
                        <div
                            style={{
                                margin: "24px 0",
                                padding: "18px 24px",
                                borderRadius: 14,
                                background:
                                    "linear-gradient(90deg,#fffbe6 60%,#ffe58f 100%)",
                                boxShadow: "0 2px 12px 0 #ffecb540",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                fontSize: 16,
                                color: "#ad6800",
                                fontWeight: 500,
                            }}
                        >
                            <ClockCircleOutlined
                                style={{ fontSize: 24, color: "#faad14" }}
                            />
                            <span>
                                Tài khoản <b>chưa xác thực</b> sẽ bị xoá sau{" "}
                                <b>10 phút</b> kể từ lúc đăng ký. Thời gian này
                                sẽ được <b>đặt lại</b> sau khi gửi lại mã xác
                                thực
                            </span>
                        </div>
                        <Form
                            name="verifystep0"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item label="Tên tài khoản" name="username">
                                <Input disabled value={usernameModal} />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng không bỏ trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Địa chỉ email đã đăng ký" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={isSending} style={{marginRight: "10px"}}>
                                    Gửi mã
                                </Button>
                                {isSending &&  <LoadingOutlined />}
                            </Form.Item>
                        </Form>
                    </>
                )}
                {current === 1 && (
                    <>
                        <div
                            style={{
                                margin: "24px 0",
                                padding: "18px 24px",
                                borderRadius: 14,
                                background:
                                    "linear-gradient(90deg,#f0f5ff 60%,#e6f7ff 100%)",
                                boxShadow: "0 2px 12px 0 #b5e3fa40",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                fontSize: 16,
                                color: "#0958d9",
                                fontWeight: 500,
                                minHeight: 64,
                            }}
                        >
                            <SolutionOutlined
                                style={{ fontSize: 24, color: "#1890ff" }}
                            />
                            <span>
                                Vui lòng kiểm tra email của bạn để lấy{" "}
                                <b>mã xác thực</b> và nhập vào ô bên dưới.
                                <br />
                                <span
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 15,
                                        color: "#1d39c4",
                                    }}
                                >
                                    Nếu không thấy email, hãy kiểm tra cả mục <b>Spam</b> hoặc <b>Quảng cáo</b>.
                                </span>
                            </span>
                        </div>
                        <Form
                            name="verifystep1"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label=""
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã xác thực!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Xác nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                {current === 2 && (
                    <>
                        <div
                            style={{
                                margin: "32px 0 16px 0",
                                padding: "24px 0",
                                borderRadius: 14,
                                background:
                                    "linear-gradient(90deg,#f0f5ff 60%,#e6f7ff 100%)",
                                boxShadow: "0 2px 12px 0 #b5e3fa40",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <CheckCircleFilled
                                style={{
                                    color: "#1890ff",
                                    fontSize: 30,
                                    marginBottom: 12,
                                }}
                            />
                            <p
                                style={{
                                    fontWeight: 400,
                                    fontSize: 16,
                                    color: "#0958d9",
                                }}
                            >
                                Bạn đã kích hoạt tài khoản thành công.
                                <br />
                                Chúc bạn trải nghiệm vui vẻ trên mạng xã hội!
                            </p>
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Đóng
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
};
export default ModalActive;
