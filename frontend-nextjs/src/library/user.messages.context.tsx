'use client'

import { createContext, useContext, useState } from "react";

interface IMessagesContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
}

export const MessagesContext = createContext<IMessagesContext | null>(null);

export const MessagesContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);

    return (
        <MessagesContext.Provider value={{ collapseMenu, setCollapseMenu }}>
            {children}
        </MessagesContext.Provider>
    )
};

export const useMessagesContext = () => useContext(MessagesContext);