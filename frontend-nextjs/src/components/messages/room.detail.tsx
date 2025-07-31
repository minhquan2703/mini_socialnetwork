import {
    Avatar,
    Card,
    Menu,
    Skeleton,
    Divider,
    Button,
    Space,
    Typography,
    Badge,
    Tooltip,
    Image,
} from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { IDetailRoom, UserInRoom } from "@/types/room.type";
import { useSession } from "@/library/session.context";
import { getDetailRoom } from "@/services/chat.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import {
    UserOutlined,
    PictureOutlined,
    FileTextOutlined,
    LinkOutlined,
    SettingOutlined,
    BellOutlined,
    SearchOutlined,
    StarOutlined,
    BlockOutlined,
    LogoutOutlined,
    CrownOutlined,
    VideoCameraOutlined,
    PhoneOutlined,
    MoreOutlined,
    LeftOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    RotateRightOutlined,
    RotateLeftOutlined,
    SwapOutlined,
    DownloadOutlined,
    RightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

interface DetailRoomProps {
    roomId: string;
}

const DetailRoom = ({ roomId }: DetailRoomProps) => {
    const [data, setData] = useState<IDetailRoom>();
    const [otherInChatPrivate, setOtherInChatPrivate] = useState<UserInRoom>();
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const router = useRouter();
    const session = useSession();

    // Sample media files for demo
    const mediaFiles = [
        {
            id: 1,
            type: "image",
            url: "https://res.cloudinary.com/du5xndm99/image/upload/v1752637955/posts/ewu8tsaau84cz3efw91r.png",
            name: "image1.jpg",
        },
        {
            id: 2,
            type: "image",
            url: "https://res.cloudinary.com/du5xndm99/image/upload/v1752637959/posts/lhtnnhy2ixtuhr9bdbty.png",
            name: "image2.jpg",
        },
        {
            id: 3,
            type: "image",
            url: "https://res.cloudinary.com/du5xndm99/image/upload/v1753087308/user_avatar_448747e4-a4fc-46e3-a5e0-7a2fc0c04062/hmu69lfjh5xqykeddywf.jpg",
            name: "image3.jpg",
        },
        {
            id: 4,
            type: "image",
            url: "https://picsum.photos/120/120?random=4",
            name: "image4.jpg",
        },
        {
            id: 5,
            type: "image",
            url: "https://picsum.photos/120/120?random=5",
            name: "image5.jpg",
        },
        {
            id: 6,
            type: "image",
            url: "https://picsum.photos/120/120?random=6",
            name: "image6.jpg",
        },
    ];
    const onDownload = () => {
        const file = mediaFiles[currentImage];
        const url = file.url;
        const suffix = url.slice(url.lastIndexOf("."));
        const filename = Date.now() + suffix;

        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(blobUrl);
                link.remove();
            });
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
                    detail.type === "PRIVATE"
                        ? detail.users.find((u) => u.id !== session?.user?.id)
                        : undefined;

                setData(detail);
                setOtherInChatPrivate(otherUser);
            } catch (error) {
                console.error("Error fetching room detail:", error);
                toast.error("Không thể tải thông tin phòng chat");
                router.replace("/messages/notfound");
            } finally {
                setLoading(false);
            }
        })();
    }, [roomId, session?.user?.id, router]);

    const getDisplayInfo = () => {
        if (data?.type === "PRIVATE" && otherInChatPrivate) {
            return {
                name:
                    otherInChatPrivate.name ||
                    otherInChatPrivate.username ||
                    "Unknown User",
                image: otherInChatPrivate.image,
                avatarColor: otherInChatPrivate.avatarColor || "#f0f0f0",
                initial: (
                    otherInChatPrivate.name ||
                    otherInChatPrivate.username ||
                    "U"
                )
                    .charAt(0)
                    .toUpperCase(),
                isOnline: Math.random() > 0.5, // Demo online status
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

        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Tùy chỉnh cuộc trò chuyện",
            children: [
                { key: "theme", label: "Đổi chủ đề" },
                { key: "nickname", label: "Đặt biệt danh" },
            ],
        },
        data?.type === "PRIVATE"
            ? {
                  key: "block",
                  icon: <BlockOutlined />,
                  label: "Chặn người dùng",
                  style: { color: "#ff4d4f" },
              }
            : {
                  key: "leave",
                  icon: <LogoutOutlined />,
                  label: "Rời nhóm",
                  style: { color: "#ff4d4f" },
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
            <Card
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
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "4px",
                        border: "none",
                    }}
                >
                    <Image.PreviewGroup
                        preview={{
                            toolbarRender: (
                                _,
                                {
                                    transform: { scale },
                                    actions: {
                                        onActive,
                                        onFlipY,
                                        onFlipX,
                                        onRotateLeft,
                                        onRotateRight,
                                        onZoomOut,
                                        onZoomIn,
                                        onReset,
                                    },
                                }
                            ) => (
                                <Space size={12} className="toolbar-wrapper">
                                    <LeftOutlined
                                        disabled={currentImage === 0}
                                        onClick={() => onActive?.(-1)}
                                    />
                                    <RightOutlined
                                        disabled={
                                            currentImage ===
                                            mediaFiles.length - 1
                                        }
                                        onClick={() => onActive?.(1)}
                                    />
                                    <DownloadOutlined onClick={onDownload} />
                                    <SwapOutlined
                                        rotate={90}
                                        onClick={onFlipY}
                                    />
                                    <SwapOutlined onClick={onFlipX} />
                                    <RotateLeftOutlined
                                        onClick={onRotateLeft}
                                    />
                                    <RotateRightOutlined
                                        onClick={onRotateRight}
                                    />
                                    <ZoomOutOutlined
                                        disabled={scale === 1}
                                        onClick={onZoomOut}
                                    />
                                    <ZoomInOutlined
                                        disabled={scale === 50}
                                        onClick={onZoomIn}
                                    />
                                    <UndoOutlined onClick={onReset} />
                                </Space>
                            ),
                            onChange: (index) => {
                                setCurrentImage(index);
                            },
                        }}
                    >
                        {mediaFiles.slice(0, 6).map((file) => (
                            <div
                                key={file.id}
                                style={{
                                    aspectRatio: "1",
                                    overflow: "hidden",
                                    borderRadius: "6px",
                                }}
                            >
                                <Image
                                    src={file.url}
                                    alt={file.name}
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: "cover" }}
                                    preview={{
                                        mask: (
                                            <div style={{ fontSize: "12px" }}>
                                                Xem
                                            </div>
                                        ),
                                    }}
                                />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </div>
            </Card>
        </div>
    );
};

export default DetailRoom;
