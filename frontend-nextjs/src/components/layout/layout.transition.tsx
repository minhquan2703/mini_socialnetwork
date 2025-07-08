"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "@/library/user.context";

export default function LayoutTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const userContext = useUserContext();
    
    useEffect(() => {
        // Khi vào trang messages, collapse user sidebar
        if (pathname?.includes('/messages') && userContext) {
            userContext.setCollapseMenu(true);
        }
    }, [pathname, userContext]);
    
    return <>{children}</>;
}