"use client";
import { deleteChildComment, deleteComment } from "@/services/comment.service";
import { Button, Modal } from "antd";
import { toast } from "sonner";

interface ModalProps {
    type: string;
    id: string;
    content: string;
    isShow: boolean;
    setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteComment: (commentId: string) => void;
}
const ModalDeleteComment = (props: ModalProps) => {
    const { type, id, content, isShow, setIsShow, handleDeleteComment } = props;
    const deleteTypeComment = async () => {
        const res = await deleteComment(id);
        if (res.data) {
            setIsShow(false);
            handleDeleteComment(id);
            toast.error("Bình luận đã được xoá");
        } else if (res.error && res.message === "Comment was not found") {
            toast.error("Bình luận không tồn tại, vui lòng tải lại trang");
        } else if (res.error && res.message === "Forbidden Exception") {
            toast.error(
                "Chỉ tác giả hoặc quản trị viên mới có thể xoá bình luận này"
            );
        } else {
            toast.error(`Lỗi hệ thống; ${res.message}`);
        }
    };

    const deleteTypeChildComment = async () => {
        const res = await deleteChildComment(id);
        if (res.data) {
            setIsShow(false);
            handleDeleteComment(id);
            toast.error("Bình luận đã được xoá");
        } else if (res.error && res.message === "Comment was not found") {
            toast.error("Bình luận không tồn tại, vui lòng tải lại trang");
        } else if (res.error && res.message === "Forbidden Exception") {
            toast.error(
                "Chỉ tác giả hoặc quản trị viên mới có thể xoá bình luận này"
            );
        } else {
            toast.error(`Lỗi hệ thống; ${res.message}`);
        }
    };
    const handleOk = async () => {
        if (type === "COMMENT") {
            deleteTypeComment();
        }
        if (type === "CHILDCOMMENT") {
            deleteTypeChildComment();
        }
    };
    return (
        <>
            <Modal
                title="Xác nhận xoá"
                closable={{ "aria-label": "Custom Close Button" }}
                style={{ padding: "5px" }}
                open={isShow}
                footer={null}
                maskClosable={false}
                onCancel={() => setIsShow(false)}
            >
                <div>Nội dung: {content}</div>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        gap: "15px",
                        marginTop: "20px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ color: "red" }}>
                        Bình luận bị xoá sẽ không thể khôi phục!
                    </div>
                    <div>
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => setIsShow(false)}
                        >
                            Huỷ
                        </Button>
                        <Button
                            style={{marginLeft: "5px"}}
                            color="primary"
                            variant="solid"
                            danger
                            onClick={() => handleOk()}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default ModalDeleteComment;
