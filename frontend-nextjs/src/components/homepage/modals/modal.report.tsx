"use client";
import { postReport } from "@/services/report.service";
import { Button, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { toast } from "sonner";

interface ModalProps {
    type: 'POST' | 'COMMENT' | 'CHILDCOMMENT';
    id: string;
    isShow: boolean;
    setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalReport = (props: ModalProps) => {
    const [value, setValue] = useState<string>("");
    const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { type, id, isShow, setIsShow } = props;

    const optionsPost = [
        { value: "Copyright", label: "Vi phạm bản quyền" },
        { value: "Toxic_Content", label: "Nội dung độc hại" },
        { value: "Other", label: "Khác" },
    ];
    const optionsComment = [
        { value: "Spam", label: "Spam" },
        { value: "Harassment", label: "Quấy rối" },
        { value: "Inappropriate_Content", label: "Nội dung không phù hợp" },
        { value: "Other", label: "Khác" },
    ];

    const handleOk = async () => {
        setIsLoading(true);
        if (!selectedReason || !value) {
            toast.error("Vui lòng điền đầy đủ lý do và mô tả chi tiết");
            setIsLoading(false);
            return;
        }
        const res = await postReport({
            id,
            reason: selectedReason,
            content: value,
            type,
        });
        if (res.data) {
            toast.success("Báo cáo đã được gửi");
            setIsShow(false);
        }
        if (res.error) {
            if (res.message.includes("DUPLICATE_REPORT")) {
                const [key, createAt] = res.message.split("#");
                if (key === "DUPLICATE_REPORT") {
                    toast.error(
                        `Bạn đã báo cáo nội dung này vào lúc ${createAt}. Vui lòng chờ xử lý.`
                    );
                }
            } else if (res.message === "INVALID_REPORT_TYPE") {
                toast.error("Loại báo cáo không hợp lệ");
            } 
            else {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            }
        }
        setIsLoading(false);
    };
    return (
        <>
            <Modal
                title={`Báo cáo ${
                    type === "POST"
                        ? "bài viết"
                        : type === "COMMENT" || type === "CHILDCOMMENT"
                        ? "bình luận"
                        : ""
                }`}
                closable={{ "aria-label": "Custom Close Button" }}
                style={{ padding: "5px" }}
                open={isShow}
                footer={null}
                maskClosable={false}
                onCancel={() => setIsShow(false)}
            >
                <Select
                    showSearch
                    value={selectedReason}
                    notFoundContent="Không tìm thấy lý do phù hợp"
                    onChange={setSelectedReason}
                    placeholder="Lý do báo cáo"
                    filterOption={(input, option) =>
                        (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={type === "POST" ? optionsPost : optionsComment}
                    size="middle"
                    style={{ width: "100%", marginTop: "10px" }}
                />
                <TextArea
                    value={value}
                    autoFocus
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Mô tả chi tiết"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{
                        width: "100%",
                        marginTop: "15px",
                        marginBottom: "15px",
                    }}
                />
                <div>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => setIsShow(false)}
                    >
                        Huỷ
                    </Button>
                    <Button
                        style={{ marginLeft: "5px" }}
                        type="primary"
                        onClick={() => handleOk()}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Báo cáo
                    </Button>
                </div>
            </Modal>
        </>
    );
};
export default ModalReport;
