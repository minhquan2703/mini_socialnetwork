"use client";
import { updateChildComment, updateComment } from "@/services/comment.service";
import { Button, Modal } from "antd";
import { toast } from "sonner";

interface ModalProps {
    type: string;
    id: string;
    updatedContent: string;
    isShowModalUpdate: boolean;
    setIsShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalUpdateComment = (props: ModalProps) => {
    const {
        type,
        id,
        updatedContent,
        isShowModalUpdate,
        setIsShowModalUpdate,
        setContent,
        setIsUpdating,
    } = props;
    const updateTypeComment = async () => {
        const res = await updateComment({ id: id, content: updatedContent });
        if (res.data) {
            setContent(res.data.content);
            setIsShowModalUpdate(false);
            setIsUpdating(false);
            toast.success("Sửa bình luận thành công");
        } else if (res.message === "User was not found") {
            toast.error("Tài khoản của bạn bị lỗi, vui lòng đăng nhập lại");
        } else if (res.message === "Comment was not found") {
            toast.error("Không tìm thấy bình luận, vui lòng tải lại trang");
        } else if (res.message === "Forbidden Exception") {
            toast.error(
                "Chức năng này chỉ dành cho tác giả hoặc quản trị viên"
            );
        } else {
            toast.error(
                `Lỗi: ${res.message}. Vui lòng liên hệ với quản trị viên`
            );
        }
    };

    const updateTypeChildComment = async () => {
        const res = await updateChildComment({
            id: id,
            content: updatedContent,
        });
        if (res.data) {
            setContent(res.data.content);
            setIsShowModalUpdate(false);
            setIsUpdating(false);
            toast.success("Sửa bình luận thành công");
        } else if (res.message === "User was not found") {
            toast.error("Tài khoản của bạn bị lỗi, vui lòng đăng nhập lại");
        } else if (res.message === "Child comment was not found") {
            toast.error("Không tìm thấy bình luận, vui lòng tải lại trang");
        } else if (res.message === "Forbidden Exception") {
            toast.error(
                "Chức năng này chỉ dành cho tác giả hoặc quản trị viên"
            );
        } else {
            toast.error(
                `Lỗi: ${res.message}. Vui lòng liên hệ với quản trị viên`
            );
        }
    };
    const handleOk = async () => {
        if (type === "COMMENT") {
            updateTypeComment();
        }
        if (type === "CHILDCOMMENT") {
            updateTypeChildComment();
        }
    };
    return (
        <>
            <Modal
                title="Xác nhận thay đổi nội dung"
                closable={{ "aria-label": "Custom Close Button" }}
                style={{ padding: "10px" }}
                open={isShowModalUpdate}
                footer={null}
                maskClosable={false}
                onCancel={() => setIsShowModalUpdate(false)}
            >
                <div>{updatedContent}</div>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        gap: "15px",
                        marginTop: "20px",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => setIsShowModalUpdate(false)}
                    >
                        Huỷ
                    </Button>
                    <Button
                        color="primary"
                        variant="solid"
                        onClick={() => handleOk()}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </>
    );
};
export default ModalUpdateComment;
