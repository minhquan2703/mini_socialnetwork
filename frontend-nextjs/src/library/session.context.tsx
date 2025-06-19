"use client"; //AI generated

import { createContext, useContext, ReactNode } from 'react';
import { useState } from 'react';

interface SessionContextType {
  user?: {
    id: string;
    name?: string;
    username?: string;
    email?: string;
    image?: string;
    avatarColor?: string;
    access_token?: string;
  };
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ 
  children, 
  session 
}: { 
  children: ReactNode;
  session: SessionContextType | null;
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

// Custom hook để check auth và show modal

export const useAuthCheck = () => {
  const session = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const requireAuth = (callback: () => void) => {
    if (!session?.user) {
      setShowLoginModal(true);
      return false;
    }
    callback();
    return true;
  };
  
  return { 
    isAuthenticated: !!session?.user,
    requireAuth, 
    showLoginModal, 
    setShowLoginModal 
  };
};