"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@/library/session.context'; // Dùng custom hook của bạn
import { Socket } from 'socket.io-client';
import { initializeSocket, setupSocketHandlers } from '@/utils/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession(); // Dùng custom useSession
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session?.user?.access_token) {
      // Initialize socket with access token
      const newSocket = initializeSocket(session.user.access_token);
      
      // Setup handlers
      setupSocketHandlers(newSocket);
      
      // Track connection status
      newSocket.on('connect', () => {
        setIsConnected(true);
      });
      
      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });
      
      setSocket(newSocket);
      
      // Cleanup
      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [session]); // Chỉ phụ thuộc vào session

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};