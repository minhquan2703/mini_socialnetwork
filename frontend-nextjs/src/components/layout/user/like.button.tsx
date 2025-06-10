import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

// Component LikeButton
const LikeButton = ({ isLiked, likeCount, onLike, disabled }) => {
    const [showBoom, setShowBoom] = useState(false);

    const handleClick = () => {
        onLike();
        setShowBoom(true);
        setTimeout(() => setShowBoom(false), 550);
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <Button
                danger={isLiked}
                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleClick}
                style={{
                    fontWeight: isLiked ? "600" : "400",
                    padding: "4px 12px",
                    height: "36px",
                    borderRadius: "8px",
                }}
                disabled={disabled}
            >
                {likeCount}
            </Button>
            {/* Hiệu ứng bung tim */}
            <AnimatePresence>
                {showBoom && (
                    <motion.span
                        initial={{ scale: 0.2, opacity: 0, y: 0 }}
                        animate={{ scale: 1.5, opacity: 1, y: -25 }}
                        exit={{ scale: 0, opacity: 0, y: -40 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        style={{
                            color: "#ff4d4f",
                            position: "absolute",
                            left: "13%",
                            top: "-11px",
                            pointerEvents: "none",
                            fontSize: 20,
                            zIndex: 2,
                        }}
                    >
                        <HeartFilled />
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LikeButton;
