import {
    Avatar,
    Card,
    Menu,
    Skeleton,
    Divider,
    Button,
    Typography,
    Tooltip,
} from "antd";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { IDetailRoom, UserInRoom } from "@/types/room.type";
import { useSession } from "@/library/session.context";
import { getDetailRoom } from "@/services/chat.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import {
    UserOutlined,
    FileTextOutlined,
    SettingOutlined,
    BlockOutlined,
    LogoutOutlined,
    CrownOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import ModalGallery from "@/components/messages/modals/modal.gallery";
import ModalBlock from "./modals/modal.block";
import {
    deleteUnblockUser,
    getBlockedUsers,
    getIsBlockedByUsers,
} from "@/services/auth.service";
const { Title } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

interface DetailRoomProps {
    roomId: string;
    isBlocking: boolean;
    setIsBlocking: React.Dispatch<React.SetStateAction<boolean>>;
    isBlocked: boolean;
    setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
    isCheckingBlocked: boolean;
    setIsCheckingBlocked: React.Dispatch<React.SetStateAction<boolean>>;
    handleBlockOrUnBlock: (blocked: boolean) => void;
    setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailRoom = (props: DetailRoomProps) => {
    const {
        roomId,
        isBlocking,
        setIsBlocking,
        // isBlocked,
        setIsBlocked,
        setIsCheckingBlocked,
        handleBlockOrUnBlock,
        setIsShowUpload
    } = props;
    const [data, setData] = useState<IDetailRoom>();
    const [isShowModalGallery, setIsShowModalGallery] =
        useState<boolean>(false);
    const [isShowModalBlock, setIsShowModalBlock] = useState<boolean>(false);
    const [otherInChatPrivate, setOtherInChatPrivate] = useState<UserInRoom>();
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const session = useSession();

    const handleCheckIsBlocked = async (id: string) => {
        const res = await getIsBlockedByUsers();
        if (res && res.data) {
            const blockedUsers = res.data;
            const isBlockedNow = blockedUsers.some((user) => user.id === id);
            setIsBlocked(isBlockedNow);
        }
    };
    const handleCheckIsBlocking = async (id: string) => {
        const res = await getBlockedUsers();
        if (res && res.data) {
            const blockedUsers = res.data;
            const isBlockingNow = blockedUsers.find((user) => user.id === id);
            setIsBlocking(isBlockingNow ? true : false);
        }
    };
    const handleUnblockUser = async () => {
        if (otherInChatPrivate?.id) {
            const res = await deleteUnblockUser(otherInChatPrivate?.id);
            if (res && res.data) {
                toast.success("Bỏ chặn người dùng thành công");
                handleBlockOrUnBlock(false);
                setIsBlocking(false);
            } else {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await getDetailRoom(roomId);
                if (!res.data) {
                    toast.error("Đã có lỗi xảy ra");
                    router.replace("/messages/notfound");
                    return;
                }
                const detail = res.data;
                const otherUser =
                    detail.type === "PRIVATE" &&
                    detail.users.find((u) => u.id !== session?.user?.id);

                setData(detail);
                if (otherUser) {
                    setOtherInChatPrivate(otherUser);
                }
            } catch (error) {
                console.error("Error fetching room detail:", error);
                toast.error("Không thể tải thông tin phòng chat");
                router.replace("/messages/notfound");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (otherInChatPrivate?.id && data?.type === "PRIVATE") {
            const checkBlockStatus = async () => {
                setIsCheckingBlocked(true);
                try {
                    await Promise.all([
                        handleCheckIsBlocking(otherInChatPrivate.id),
                        handleCheckIsBlocked(otherInChatPrivate.id),
                    ]);
                } catch (error) {
                    console.error("Error checking block status:", error);
                } finally {
                    setIsCheckingBlocked(false);
                }
            };

            checkBlockStatus();
        }
    }, [otherInChatPrivate?.id, data?.type]);

    const getDisplayInfo = () => {
        if (data?.type === "PRIVATE" && otherInChatPrivate) {
            return {
                name: otherInChatPrivate.name || otherInChatPrivate.username,
                image: otherInChatPrivate.image,
                avatarColor: otherInChatPrivate.avatarColor || "#f0f0f0",
                initial: (
                    otherInChatPrivate.name || otherInChatPrivate.username
                )
                    .charAt(0)
                    .toUpperCase(),
                isOnline: Math.random() > 0.5,
            };
        } else if (data?.type === "GROUP") {
            return {
                name: data.name || "Group Chat",
                image: data.avatar,
                avatarColor: "#f0f0f0",
                initial: (data.name || "G").charAt(0).toUpperCase(),
                isOnline: false,
            };
        }
        return {
            name: "Unknown",
            image: null,
            avatarColor: "#f0f0f0",
            initial: "U",
            isOnline: false,
        };
    };

    const menuItems: MenuItem[] = [
        data?.type === "GROUP"
            ? {
                  key: "members",
                  icon: <UserOutlined />,
                  label: `Thành viên (${data?.users?.length || 0})`,
                  children: data?.users?.map((user) => ({
                      key: user.id,
                      label: (
                          <div
                              style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  justifyContent: "space-between",
                              }}
                          >
                              {/* <Badge dot={Math.random() > 0.5} color="green"> */}
                              <div
                                  style={{
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                  }}
                              >
                                  <Avatar
                                      size={24}
                                      src={user.image}
                                      style={{
                                          backgroundColor: user.avatarColor,
                                      }}
                                  >
                                      {(user.name || user.username)
                                          .charAt(0)
                                          .toUpperCase()}
                                  </Avatar>
                                  {/* </Badge> */}
                                  <span>{user.name || user.username}</span>
                              </div>

                              {user.id === session?.user?.id && (
                                  <CrownOutlined
                                      style={{
                                          color: "#yellow",
                                          fontSize: "17px",
                                      }}
                                  />
                              )}
                          </div>
                      ),
                  })),
              }
            : null,

        // {
        //     key: "settings",
        //     icon: <SettingOutlined />,
        //     label: "Tùy chỉnh cuộc trò chuyện",
        //     children: [
        //         { key: "theme", label: "Đổi chủ đề" },
        //         { key: "nickname", label: "Đặt biệt danh" },
        //     ],
        // },
        data?.type === "PRIVATE"
            ? {
                  key: "block",
                  icon: <BlockOutlined />,
                  label: isBlocking ? "Bỏ chặn" : "Chặn người dùng",
                  style: { color: "#ff4d4f" },
                  onClick: () =>
                      isBlocking
                          ? handleUnblockUser()
                          : setIsShowModalBlock(true),
              }
            : {
                  key: "leave",
                  icon: <LogoutOutlined />,
                  label: "Rời nhóm",
                  style: { color: "#ff4d4f" },
              },
        {
            key: "files",
            icon: <FileTextOutlined />,
            label: "Kho lưu trữ ảnh và video",
            onClick: () => setIsShowModalGallery(true),
        },
    ];

    if (loading || !data) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <SkeletonAvatar size={100} style={{ margin: "20px 0" }} />
                <Skeleton active paragraph={{ rows: 3 }} />
            </div>
        );
    }

    const displayInfo = getDisplayInfo();

    return (
        <div
            style={{
                height: "100vh",
                overflowY: "auto",
                backgroundColor: "#fafafa",
                marginRight: 15,
            }}
        >
            {/* Header Profile */}
            <Card
                variant="borderless"
                style={{
                    textAlign: "center",
                    // background:
                    //     "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    background: "rgba(255,255,255,0.2)",
                }}
            >
                {/* <Badge 
                    dot={displayInfo.isOnline} 
                    color="green" 
                    offset={[-10, 10]}
                > */}
                <Avatar
                    size={80}
                    src={displayInfo.image}
                    style={{
                        backgroundColor: displayInfo.avatarColor,
                        color: "#222",
                        fontWeight: "600",
                        fontSize: "24px",
                        border: "3px solid white",
                    }}
                >
                    {displayInfo.initial}
                </Avatar>
                {/* </Badge> */}

                <Title
                    level={4}
                    style={{
                        color: "black",
                        marginTop: "12px",
                        marginBottom: "4px",
                    }}
                >
                    {displayInfo.name}
                </Title>

                {/* <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {data.type === "PRIVATE" 
                        ? (displayInfo.isOnline ? "Đang hoạt động" : "Không hoạt động")
                        : `${data.users?.length || 0} thành viên`
                    }
                </Text> */}
                {/* Action Buttons */}
                {data.type === "PRIVATE" && (
                    <div
                        style={{
                            marginTop: "16px",
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                            color: "black",
                        }}
                    >
                        <Tooltip title="Trang cá nhân" placement="left">
                            <Button
                                type="text"
                                icon={<UserOutlined />}
                                style={{
                                    color: "black",
                                    border: "1px solid black",
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Tùy chọn khác">
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                style={{
                                    color: "black",
                                    border: "1px solid black",
                                }}
                            />
                        </Tooltip>
                    </div>
                )}
            </Card>

            <Divider style={{ margin: 0 }} />

            {/* Menu Options */}
            <Menu
                selectable={false}
                mode="inline"
                items={menuItems}
                style={{
                    borderRight: "none",
                    backgroundColor: "transparent",
                }}
                expandIcon={({ isOpen }) => (
                    <span
                        style={{
                            transform: isOpen
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    >
                        ▶
                    </span>
                )}
            />
            {/* Media Preview */}
            {/* <Card
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <PictureOutlined />
                        <span>Ảnh & Video gần đây</span>
                    </div>
                }
                size="small"
                style={{ margin: "0", borderRadius: 0 }}
                extra={
                    <Button type="link" size="small">
                        Xem tất cả
                    </Button>
                }
            >
                <MiniGallery/>
            </Card> */}
            <ModalGallery
                roomId={roomId}
                isModalOpen={isShowModalGallery}
                setIsModalOpen={setIsShowModalGallery}
            />
            {isShowModalBlock && otherInChatPrivate && (
                <ModalBlock
                    isShowModal={isShowModalBlock}
                    setIsShowModal={setIsShowModalBlock}
                    id={otherInChatPrivate.id}
                    name={otherInChatPrivate.name}
                    setIsBlocking={setIsBlocking}
                    handleBlockOrUnBlock={handleBlockOrUnBlock}
                    setIsShowUpload={setIsShowUpload}
                />
            )}
        </div>
    );
};

export default React.memo(DetailRoom);
