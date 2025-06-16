"use client";
import { useSession } from "@/library/session.context";
import { useHasMounted } from "@/utils/customHook";
import { Avatar, Modal } from "antd";

const ModalSetAvatar = (props: any) => {
    const { isModalOpen, setIsModalOpen } = props;
    const session = useSession();
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    return (
        <>
            <Modal
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                width={500}
            >
                <div style={{ margin: "auto", width: "100%" }}>
                    <Avatar
                        size={200}
                        style={{
                            display: "block",
                            // width: "100px",
                            // height: "100px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    ></Avatar>
                    <Avatar
                        size={44}
                        src={session?.user?.image}
                        style={{
                            backgroundColor:
                                `${session?.user?.avatarColor}` || "#fff",
                            color: "#222",
                            fontSize: "20px",
                            fontWeight: "600",
                        }}
                    >
                        {session?.user?.name?.charAt(0).toUpperCase() ||
                            session?.user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                </div>

                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};
export default ModalSetAvatar;
