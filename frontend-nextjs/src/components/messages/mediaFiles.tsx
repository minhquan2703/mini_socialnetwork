import { useState } from "react";
import { Modal, Image, Tooltip } from "antd";
import ReactPlayer from "react-player";

const mediaFiles = [
    {
        id: 1,
        type: "image",
        url: "https://res.cloudinary.com/du5xndm99/image/upload/v1752637955/posts/ewu8tsaau84cz3efw91r.png",
        name: "image1.jpg",
    },
    {
        id: 2,
        type: "video",
        url: "https://res.cloudinary.com/du5xndm99/video/upload/v1752636577/posts/yl3golv9uvcylei3ufjc.mp4",
        name: "video1.mp4",
        duration: "00:12", // demo, có thể lấy bằng ReactPlayer hoặc metadata
    },
    {
        id: 3,
        type: "image",
        url: "https://res.cloudinary.com/du5xndm99/image/upload/v1753087308/user_avatar_448747e4-a4fc-46e3-a5e0-7a2fc0c04062/hmu69lfjh5xqykeddywf.jpg",
        name: "image2.jpg",
    },
    {
        id: 4,
        type: "image",
        url: "https://res.cloudinary.com/du5xndm99/image/upload/v1753087308/user_avatar_448747e4-a4fc-46e3-a5e0-7a2fc0c04062/hmu69lfjh5xqykeddywf.jpg",
        name: "image2.jpg",
    },    
    {
        id: 5,
        type: "image",
        url: "https://res.cloudinary.com/du5xndm99/image/upload/v1753087308/user_avatar_448747e4-a4fc-46e3-a5e0-7a2fc0c04062/hmu69lfjh5xqykeddywf.jpg",
        name: "image2.jpg",
    },    
];

const MiniGallery = () => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewType, setPreviewType] = useState<"image" | "video" | null>(
        null
    );
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const handlePreview = (type: "image" | "video", url: string) => {
        setPreviewType(type);
        setPreviewUrl(url);
        setPreviewVisible(true);
    };

    return (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", border: "1px solid green", overflow: "hidden", height: "100%"}}>
            {mediaFiles.map((file) =>
                file.type === "image" ? (
                    <div
                        key={file.id}
                        style={{
                            display: "inline-block",
                            border: "1px solid red",

                            borderRadius: 8,
                            overflow: "hidden",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Image
                            src={file.url}
                            height={90}
                            width={100}
                            preview={true}
                            object-fit="cover"
                            alt=""
                        />
                    </div>
                ) : (
                    <div
                        key={file.id}
                        style={{
                            position: "relative",
                            width: 100,
                            height: 90,
                            borderRadius: 8,
                            overflow: "hidden",
                            background: "#222",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                        onClick={() => handlePreview("video", file.url)}
                    >
                        <ReactPlayer
                            url={file.url}
                            width="100px"
                            height="90px"
                            light={true}
                        />
                        <span
                            style={{
                                position: "absolute",
                                right: 6,
                                bottom: 6,
                                background: "rgba(0,0,0,0.7)",
                                color: "#fff",
                                fontSize: 12,
                                padding: "2px 6px",
                                borderRadius: 4,
                            }}
                        >
                            {file.duration || "00:00"}
                        </span>
                    </div>
                )
            )}
            <Modal
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                centered
                width={previewType === "video" ? 600 : 400}
                style={{ padding: 0 }}
            >
                {previewType === "image" ? (
                    <Image src={previewUrl} width="100%" alt="" />
                ) : (
                    <ReactPlayer
                        url={previewUrl}
                        controls
                        width="100%"
                        style={{ borderRadius: "25px" }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default MiniGallery;
