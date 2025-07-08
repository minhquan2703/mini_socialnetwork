import UserSideBar from "@/components/layout/user/user.sidebar";
import UserHeader from "@/components/layout/user/user.header";
import UserContent from "@/components/layout/user/user.content";
import { UserContextProvider } from "@/library/user.context";
import { auth } from "@/auth";
import { SessionProvider } from "@/library/session.context";
import { SocketProvider } from "@/library/socket.context";
import LayoutTransition from "@/components/layout/layout.transition";

const UserLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <SocketProvider>
                <UserContextProvider>
                    <LayoutTransition>
                        <div style={{ display: "flex" }}>
                            <div className="left-side" style={{ minWidth: "80px" }}>
                                <UserSideBar />
                            </div>
                            <div className="right-side" style={{ flex: 1 }}>
                                <UserHeader />
                                <UserContent>{children}</UserContent>
                            </div>
                        </div>
                    </LayoutTransition>
                </UserContextProvider>
            </SocketProvider>
        </SessionProvider>
    );
};

export default UserLayout;