import { io, Socket } from "socket.io-client";

// Khởi tạo socket nhưng chưa kết nối
let socket: Socket | null = null;

// Function để khởi tạo socket với token
export const initializeSocket = (accessToken: string) => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001', {
        auth: {
            token: accessToken,
        },
        transports: ["websocket"],
        autoConnect: true,
    });

    setupSocketHandlers(socket);

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        console.warn("Socket not initialized. Call initializeSocket first.");
        return null;
    }
    return socket;
};

// Thêm socket event handlers chung
export const setupSocketHandlers = (socket: Socket) => {
    socket.on("connect", () => {
        console.log("Connected to server");
    });

    socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
    });
};

export default getSocket;