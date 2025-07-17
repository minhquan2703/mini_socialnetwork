import { handleUpdateUserAction } from "@/utils/action";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";
import { startTransition, useEffect } from "react";
import { toast } from "sonner";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: IUserData | null;
    setDataUpdate: React.Dispatch<React.SetStateAction<IUserData | null>>;
}
interface IUserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface IUpdateUserFormValues {
    name: string;
    email: string;
    phone?: string;
}

const UserUpdate = (props: IProps) => {
    const {
        isUpdateModalOpen,
        setIsUpdateModalOpen,
        dataUpdate,
        setDataUpdate,
    } = props;

    const [form] = Form.useForm<IUpdateUserFormValues>();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone || "",
            });
        }
    }, [dataUpdate, form]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    };

    const onFinish = async (values: IUpdateUserFormValues) => {
        if (dataUpdate) {
            const { name, phone } = values;
            if (phone && phone.length > 11) {
                toast.error('Số điện thoại không được dài quá 11 số')
                return;
            }
            startTransition(async () => {
                const res = await handleUpdateUserAction({
                    id: dataUpdate.id,
                    name,
                    phone: phone || "",
                });
                console.log('check res upate', res)
                if (res?.data) {
                    handleCloseUpdateModal();
                    message.success("Update user succeed");
                } else {
                    notification.error({
                        message: "Update User error",
                        description: res?.message,
                    });
                }
            });
        }
    };

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Email" name="email">
                            <Input type="email" disabled />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phone" name="phone">
                            <Input  type="number" maxLength={10}/>
                        </Form.Item>
                    </Col>

                    {/* <Col span={24} md={12}>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </Modal>
    );
};

export default UserUpdate;
