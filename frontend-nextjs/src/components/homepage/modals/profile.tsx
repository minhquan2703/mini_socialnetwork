"use client";
import { useSession } from "@/library/session.context";
import { postCreatePrivatedRoom } from "@/services/chat.service";
import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileProps {
    image: string;
    name?: string | "";
    avatarColor: string;
    username: string;
    id: string;
}
const Profile = ({ image, name, avatarColor, username, id }: ProfileProps) => {
    const session = useSession();
    const router = useRouter();
    const handleComunicate = async () => {
        const res = await postCreatePrivatedRoom({
            receiverId: id,
            type: "PRIVATE",
        });
        if (res && res.data) {
            router.push(`/messages/${res.data.id}`);
        } else if (res.error && res.message === "Invalid Receiver") {
            toast.error("Tự kỉ hả...");
        } else if (res.error && res.message === "Error Authenticated") {
            toast.error("Người dùng không tồn tại");
        } else {
            toast.error(res.message);
        }
    };
    return (
        <>
            <div
                style={{
                    color: "black",
                    minHeight: "150px",
                    minWidth: "100px",
                    padding: "20px 10px",
                    zIndex: "99",
                }}
            >
                <div
                    className="information"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                    }}
                >
                    <Avatar
                        size={60}
                        src={image}
                        style={{
                            backgroundColor: `${avatarColor}`,
                            color: "#222",
                            fontWeight: "600",
                            fontSize: "18px",
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        {name?.charAt(0) || username.charAt(0)}
                    </Avatar>
                    <div
                        style={{
                            fontWeight: "600",
                            fontSize: "20px",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        {name || username}
                    </div>
                </div>
                <div className="actions" style={{ textAlign: "center" }}>
                    <Button
                        variant="text"
                        color="cyan"
                        size="middle"
                        onClick={() => handleComunicate()}
                        disabled={session?.user?.id === id}
                    >
                        <MessageOutlined style={{ fontSize: "22px" }} />
                        <span>Nhắn tin</span>
                    </Button>
                </div>
            </div>
        </>
    );
};
export default Profile;
