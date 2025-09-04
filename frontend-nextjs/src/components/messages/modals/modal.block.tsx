import { postBlockUser } from "@/services/auth.service";
import { Button, Modal } from "antd";
import "@/components/messages/modals/modalBlock.scss";
import { toast } from "sonner";
interface PropsModalBlock {
    name: string;
    id: string;
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsBlocking: React.Dispatch<React.SetStateAction<boolean>>;
    handleBlockOrUnBlock: (blocked: boolean) => void;
    setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalBlock = (props: PropsModalBlock) => {
    const {
        name,
        id,
        isShowModal,
        setIsShowModal,
        setIsBlocking,
        handleBlockOrUnBlock,
        setIsShowUpload,
    } = props;
    const handleBlock = async () => {
        const res = await postBlockUser(id);
        if (res.data) {
            setIsShowModal(false);
            setIsBlocking(true);
            handleBlockOrUnBlock(true);
            if (setIsShowUpload) {
                setIsShowUpload(false);
            }
            toast.success("Chặn người dùng thành công");
        } else if (res.error && res.message === "User is already blocked") {
            toast.error("Người dùng đã bị chặn trước đó");
            setIsShowModal(false);
        } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            setIsShowModal(false);
        }
    };
    if (!id || !name) return null;

    return (
        <Modal
            title={`Chặn ${name}`}
            open={isShowModal}
            onCancel={() => setIsShowModal(false)}
            footer={null}
            className="modal-block"
        >
            <div className="content">
                Bạn có chắc chắn muốn chặn <b>{name}</b> không? Người này sẽ
                không thể gửi tin nhắn hoặc thêm bạn làm bạn bè.
            </div>
            <div className="action">
                <Button
                    className="btn btn-cancel"
                    onClick={() => setIsShowModal(false)}
                >
                    Hủy
                </Button>
                <Button
                    className="btn btn-block"
                    onClick={() => handleBlock()}
                    danger
                >
                    Chặn
                </Button>
            </div>
        </Modal>
    );
};
export default ModalBlock;
