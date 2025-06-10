import { Modal, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface LoginRequireModalProps {
    open: boolean;
    onClose: () => void;
    message?: string;
}

const LoginRequireModal = ({ open, onClose, message }: LoginRequireModalProps) => {
    const router = useRouter();

    const handleLogin = () => {
        onClose();
        router.push('/login'); // Điều hướng đến trang login
    };

    const handleRegister = () => {
        onClose();
        router.push('/register'); // Điều hướng đến trang đăng ký
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            closable={false}
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <LockOutlined style={{ fontSize: '48px', color: '#666', marginBottom: '20px' }} />
                
                <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#000'
                }}>
                    Đăng nhập để tiếp tục
                </h2>
                
                <p style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '24px'
                }}>
                    {message || 'Bạn cần đăng nhập để thực hiện chức năng này'}
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Button 
                        type="primary"
                        size="large"
                        onClick={handleLogin}
                        style={{
                            background: '#000',
                            borderColor: '#000',
                            fontWeight: '500',
                            paddingLeft: '32px',
                            paddingRight: '32px'
                        }}
                    >
                        Đăng nhập
                    </Button>
                    
                    <Button 
                        size="large"
                        onClick={handleRegister}
                        style={{
                            fontWeight: '500',
                            paddingLeft: '32px',
                            paddingRight: '32px'
                        }}
                    >
                        Đăng ký
                    </Button>
                </div>

                <Button
                    type="link"
                    onClick={onClose}
                    style={{
                        marginTop: '16px',
                        color: '#666'
                    }}
                >
                    Để sau
                </Button>
            </div>
        </Modal>
    );
};

export default LoginRequireModal;