// ModalGallery.tsx
"use client";
import { Image, Modal, Spin } from "antd";
import ReactPlayer from "react-player";
import React, { useEffect, useState } from "react";
import { getFilesInRoom } from "@/services/chat.service";
import "@/components/messages/modals/modalGallery.scss"

interface PropsModalActive {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
}

const ModalGallery = (props: PropsModalActive) => {
  const [mediaFiles, setMediaFiles] = useState<any[]>();
  const [durations, setDurations] = useState<Record<string, string>>({});
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errorGetFiles, setErrorGetFiles] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isModalOpen, setIsModalOpen, roomId } = props;

  const handlePreview = (type: string, url: string) => {
    setPreviewType(type);
    setPreviewUrl(url);
  };

  const resetModal = () => {
    if (previewUrl) {
      setPreviewType(null);
      setPreviewUrl("");
    } else {
      setIsModalOpen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFiles = async () => {
    if (!roomId) return;
    const res = await getFilesInRoom(roomId);
    if (res.data && res.statusCode === 200) {
      setMediaFiles(res.data);
    } else {
      setErrorGetFiles(true);
    }
    setIsLoading(false);
  };


  return (
    <Modal
      title={previewUrl ? null : "Kho lưu trữ"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalOpen}
      onCancel={resetModal}
      maskClosable={false}
      footer={null}
      className="modal-gallery"
    >
      {!errorGetFiles ? (
        <div className="mg-grid">
          {previewType === "video" ? (
            <div className="mg-player">
              <ReactPlayer url={previewUrl} controls width="100%" height="100%" />
            </div>
          ) : (
            <>
              {mediaFiles &&
                mediaFiles.length > 0 &&
                mediaFiles.map((file) => {
                  switch (file.type) {
                    case "image":
                      return (
                        <div key={file.id} className="mg-image-card">
                          <Image
                            src={file.url}
                            className="mg-image"
                            preview={true}
                            alt=""
                          />
                        </div>
                      );
                    case "video":
                      return (
                        <div
                          key={file.id}
                          className="mg-video-thumb"
                          onClick={() => handlePreview("video", file.url)}
                        >
                          <ReactPlayer
                            url={file.url}
                            width="113px"
                            height="100px"
                            onDuration={(duration) => {
                              setDurations((prev) => ({
                                ...prev,
                                [file.id]: formatTime(duration),
                              }));
                            }}
                          />
                          <div className="mg-play">
                            <span className="mg-play-triangle" />
                          </div>
                          <span className="mg-duration">
                            {durations[file.id] || "--:--"}
                          </span>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
            </>
          )}
        </div>
      ) : (
        <div className="mg-error">Đã có lỗi xảy ra, vui lòng tải lại trang</div>
      )}
      {isLoading && <div className="mg-loading">Đang tải... <Spin/></div>}
      {!isLoading && !errorGetFiles && mediaFiles && mediaFiles.length === 0 && (
        <div className="mg-no-files">Chưa có hình ảnh/video được chia sẻ</div>
      )}
    </Modal>
  );
};

export default React.memo(ModalGallery);
