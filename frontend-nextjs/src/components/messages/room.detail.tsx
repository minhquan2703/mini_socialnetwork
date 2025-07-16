import { Avatar, Card, Image, Menu, Skeleton, Space, Spin } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { IDetailRoom, UserInRoom } from "@/types/room.type";
import { useSession } from "@/library/session.context";
import { getDetailRoom } from "@/services/chat.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import SkeletonImage from "antd/es/skeleton/Image";
import SkeletonCard from "../homepage/skeleton.card";
type MenuItem = Required<MenuProps>["items"][number];
interface DetailRoomProps {
    roomId: string;
}
const DetailRoom = ({ roomId }: DetailRoomProps) => {
    const [current, setCurrent] = useState<number>(0);
    const [data, setData] = useState<IDetailRoom>();
    const [otherInChatPrivate, setOtherInChatPrivate] = useState<UserInRoom>();
    const [others, setOthers] = useState<UserInRoom[]>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const session = useSession();
    const imageList = [
        "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
        "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
        "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
        "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
    ];
    useEffect(() => {
        (async () => {
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
            setOthers(detail.users);
            setLoading(false);
        })();
    }, [roomId]);
    const onDownload = () => {
        const url = imageList[current];
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
    const items: MenuItem[] = [
        // {
        //     key: "grp",
        //     type: "group",
        //     children: [
        //         {
        //             key: "action",
        //             label: "Tuỳ chỉnh",
        //             icon: <InfoCircleOutlined />,
        //             children: [
        //                 { key: "5", label: "Đổi màu nền" },
        //                 {
        //                     key: "6",
        //                     label: "Chặn người dùng",
        //                     style: { color: "red" },
        //                 },
        //             ],
        //         },
        //         {
        //             type: "divider",
        //         },
        //         {
        //             key: "contact",
        //             label: "Hình ảnh/Video",
        //             icon: <AppstoreOutlined />,
        //             children: [
        //                 imageList.map((image) => {})
        //             ]
        //         },
        //     ],
        // },
    ];
    if (loading || !data) {
        return (
            <>
                <div style={{textAlign: "center"}}>
                    <SkeletonAvatar size={90} style={{ margin: "20px 0" }} />{" "}
                    <Skeleton active/>
                </div>
            </>
        );
    }
    return (
        <>
            {/* User Profile Section */}
            <Card
                variant="borderless"
                styles={{
                    body: {
                        padding: "24px 16px",
                        borderBottom: "1px solid #f0f0f0",
                    },
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <Avatar
                        size={60}
                        src={otherInChatPrivate?.image || data?.avatar}
                        style={{
                            backgroundColor: `${
                                otherInChatPrivate?.avatarColor || "#fff"
                            }`,
                            color: "#222",
                            fontWeight: "600",
                            fontSize: "18px",
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        {otherInChatPrivate ? (
                            otherInChatPrivate?.name.charAt(0) ||
                            otherInChatPrivate?.username.charAt(0)
                        ) : (
                            <></>
                        )}
                    </Avatar>

                    <div style={{ overflow: "hidden" }}>
                        <div
                            style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#000",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {otherInChatPrivate?.name ||
                                otherInChatPrivate?.username ||
                                data?.name}
                        </div>
                        <div
                            style={{
                                fontSize: "13px",
                                color: "#666",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        ></div>
                    </div>
                </div>
            </Card>

            {/* Navigation Menu */}
            <Menu
                mode="inline"
                defaultSelectedKeys={["home"]}
                items={items}
                style={{
                    borderRight: "none",
                    marginTop: "8px",
                }}
                styles={{
                    item: {
                        marginBlock: 4,
                        marginInline: 8,
                        borderRadius: 8,
                        fontSize: "14px",
                        height: 42,
                    },
                    subMenuItem: {
                        marginBlock: 4,
                        marginInline: 8,
                        borderRadius: 8,
                        fontSize: "14px",
                    },
                    icon: {
                        fontSize: "16px",
                    },
                    itemIcon: {
                        color: "#666",
                    },
                    itemText: {
                        color: "#333",
                    },
                    itemSelectedBg: "#f5f5f5",
                    itemSelectedColor: "#000",
                    itemHoverBg: "#fafafa",
                    itemHoverColor: "#000",
                    itemActiveBg: "#f0f0f0",
                    subMenuItemBg: "transparent",
                    horizontalItemHoverBg: "#fafafa",
                    horizontalItemSelectedBg: "#f5f5f5",
                    horizontalItemSelectedColor: "#000",
                }}
            />
        </>
    );
};
export default DetailRoom;
