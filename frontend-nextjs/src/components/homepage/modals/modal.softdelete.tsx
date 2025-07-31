"use client";
import { Button, Modal } from "antd";

interface ModalProps {
    type: string,
    id: string;
    isShowModalUpdate: boolean;
    setIsShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalConfirmUpdate = (props: ModalProps) => {
    const {
        type,
        id,
        isShowModalUpdate,
        setIsShowModalUpdate,
    } = props;
    const handleOk = async () => {
        alert('me')
    };
    return (
        <>
            <Modal
                title="Xác nhận xoá nội dung"
                closable={{ "aria-label": "Custom Close Button" }}
                style={{padding: "10px"}}
                open={isShowModalUpdate}
                footer={null}
                maskClosable={false}
                onCancel={() => setIsShowModalUpdate(false)}
            >
                <div>Nội dung sẽ được đưa vào thùng rác, bạn có thể khôi phục trong 30 ngày</div>
                <div>{id}</div>
                <div style={{ width: "100%", display: "flex", gap: "15px", marginTop: "20px", justifyContent: "flex-end", alignItems:"center"}}>
                    <Button color="primary" variant="outlined" onClick={() => setIsShowModalUpdate(false)}>Huỷ</Button>
                    <Button color="primary" variant="solid" danger onClick={() => handleOk()}>Xác nhận</Button>
                </div>
            </Modal>
        </>
    );
};
export default ModalConfirmUpdate;
