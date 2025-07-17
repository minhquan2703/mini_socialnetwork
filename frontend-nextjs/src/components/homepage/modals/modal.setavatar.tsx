"use client";
import { useSession } from "@/library/session.context";
import { postAvatarUser } from "@/services/auth.service";
import { useHasMounted } from "@/utils/customHook";
import { UploadOutlined, CameraOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ModalSetAvatarProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSetAvatar = (props: ModalSetAvatarProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const session = useSession();
    const router = useRouter()
    
    const handleChange = (info: UploadChangeParam<UploadFile>) => {
        const fileList = info.fileList;
        const file = fileList[fileList.length - 1].originFileObj;
        if (file) {
            setSelectedFile(file);
            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);
        }
    };
    
    const handleChangeAvatar = async () => {
        const data = new FormData();
        if (selectedFile) {
            data.append(`file`, selectedFile);
        } else {
            toast.error("Không xác định được hình ảnh, vui lòng tải lại trang");
        }

        const res = await postAvatarUser(data);
        if (res.data && res.statusCode === 201) {
            setIsModalOpen(false);
            setPreviewUrl(null);
            setPreviewUrl(null);
            const resRelogin = await signIn("refresh-token-provider", {
                redirect: false,
                access_token: session?.user?.access_token,
            });
            if(resRelogin.error && resRelogin.status !== 200){
                toast.error('Đã có lỗi xảy ra trong quá trình cập nhật, vui lòng đăng nhập lại');
                signOut();
                router.push('/auth');
            }
            toast.success("Cập nhật avatar thành công");
            setTimeout(()=>{
                window.location.reload()
            },200)
        }
        if (res.error) {
            toast.error(res.message);
        }
    };

    // const resetModal = () => {
    //     if (previewUrl) {
    //         URL.revokeObjectURL(previewUrl);
    //         setPreviewUrl(null);
    //     }
    //     setSelectedFile(null);
    // };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    return (
        <>
            <Modal
                title={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a'
                    }}>
                        <CameraOutlined style={{ color: '#1890ff' }} />
                        Cập nhật ảnh đại diện
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                maskClosable={false}
                width={480}
                centered
                styles={{
                    header: {
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: '16px',
                        marginBottom: '24px'
                    }
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                    padding: "8px 0 24px 0",
                }}>
                    {/* Avatar Preview Section */}
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            position: 'relative',
                            padding: '8px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}>
                            <Avatar
                                size={140}
                                src={previewUrl || session?.user?.image || undefined}
                                style={{
                                    backgroundColor: session?.user?.avatarColor || "#f5f5f5",
                                    color: "#666",
                                    fontSize: "56px",
                                    fontWeight: 500,
                                    border: '4px solid white',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                }}
                                icon={!previewUrl && !session?.user?.image ? <UserOutlined /> : null}
                            >
                                {!previewUrl && !session?.user?.image && session?.user?.name
                                    ? session?.user?.name?.charAt(0).toUpperCase() ||
                                      session?.user?.username?.charAt(0).toUpperCase()
                                    : null}
                            </Avatar>
                            
                            {/* Camera overlay when hovering */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(0,0,0,0.6)',
                                borderRadius: '50%',
                                width: '140px',
                                height: '140px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: selectedFile ? 0 : 0.8,
                                transition: 'opacity 0.3s ease',
                                pointerEvents: 'none'
                            }}>
                                <CameraOutlined style={{ 
                                    fontSize: '32px', 
                                    color: 'white' 
                                }} />
                            </div>
                        </div>
                        
                        <div style={{
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            {previewUrl ? 'Ảnh đại diện mới' : 'Ảnh đại diện hiện tại'}
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center'
                    }}>
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleChange}
                            accept="image/*"
                            style={{ width: '100%' }}
                        >
                            <Button 
                                icon={<UploadOutlined />}
                                size="large"
                                style={{
                                    width: '280px',
                                    height: '48px',
                                    borderRadius: '24px',
                                    border: '2px dashed #d9d9d9',
                                    background: '#fafafa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1890ff';
                                    e.currentTarget.style.background = '#f0f8ff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                    e.currentTarget.style.background = '#fafafa';
                                }}
                            >
                                Chọn ảnh từ máy
                            </Button>
                        </Upload>

                        <div style={{
                            fontSize: '13px',
                            color: '#999',
                            textAlign: 'center',
                            lineHeight: '1.4'
                        }}>
                            Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)<br/>
                            Khuyến nghị: Ảnh vuông, kích thước 400x400px
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '8px'
                    }}>
                        <Button
                            size="large"
                            onClick={handleCancel}
                            style={{
                                minWidth: '120px',
                                height: '44px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleChangeAvatar}
                            disabled={!selectedFile}
                            style={{
                                minWidth: '160px',
                                height: '44px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '500',
                                background: selectedFile ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                                border: 'none',
                                boxShadow: selectedFile ? '0 4px 15px rgba(102, 126, 234, 0.4)' : undefined
                            }}
                        >
                            {selectedFile ? 'Cập nhật ảnh đại diện' : 'Chọn ảnh để tiếp tục'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalSetAvatar;