"use client";
import { updatePost } from "@/services/post.service";
import { Button, Modal } from "antd";
import { toast } from "sonner";

interface ModalProps {
    id: string;
    updatedContent: string;
    isShowModalUpdate: boolean;
    setIsShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalConfirmUpdate = (props: ModalProps) => {
    const {
        id,
        updatedContent,
        isShowModalUpdate,
        setIsShowModalUpdate,
        setContent,
        setIsUpdating,
    } = props;
    const handleOk = async () => {
        const res = await updatePost({ id: id, content: updatedContent });
        if (res.data) {
            setContent(res.data.content);
            setIsShowModalUpdate(false);
            setIsUpdating(false);
            toast.success("Cập nhật bài viết thành công");
        } else if (res.message === "User was not found") {
            toast.error(
                "Tài khoản của bạn bị lỗi, vui lòng đăng nhập lại để cập nhật bài viết"
            );
        } else if (res.message === "Post was not found") {
            toast.error(
                "Không tìm thấy bài viết, có thể đã bị xoá trước khi bạn sửa nội dung!"
            );
        } else {
            toast.error(res.message);
        }
    };
    return (
        <>
            <Modal
                title="Xác nhận thay đổi nội dung"
                closable={{ "aria-label": "Custom Close Button" }}
                style={{padding: "10px"}}
                open={isShowModalUpdate}
                footer={null}
                maskClosable={false}
                onCancel={() => setIsShowModalUpdate(false)}
            >
                <div>Nội dung bài viết được chỉnh sửa thành:</div>
                <div>{updatedContent}</div>
                <div style={{ width: "100%", display: "flex", gap: "15px", marginTop: "20px", justifyContent: "flex-end", alignItems:"center"}}>
                    <Button color="primary" variant="outlined" onClick={() => setIsShowModalUpdate(false)}>Huỷ</Button>
                    <Button color="primary" variant="solid" onClick={() => handleOk()}>Xác nhận</Button>
                </div>
            </Modal>
        </>
    );
};
export default ModalConfirmUpdate;
