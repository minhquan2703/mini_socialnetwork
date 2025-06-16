import UserSideBar from "@/components/layout/user/user.sidebar";
import UserHeader from "@/components/layout/user/user.header";
import UserContent from "@/components/layout/user/user.content";
import { UserContextProvider } from "@/library/user.context";
import { auth } from "@/auth";
import { SessionProvider } from "@/library/session.context";

const UserLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();
    
    return (
        <SessionProvider session={session}>
            <UserContextProvider>
                <div style={{ display: "flex" }}>
                    <div
                        className="left-side"
                        style={{ minWidth: "80px" }}
                    >
                        <UserSideBar />
                    </div>
                    <div className="right-side" style={{ flex: 1 }}>
                        <UserHeader />
                        <UserContent>{children}</UserContent>
                    </div>
                </div>
            </UserContextProvider>
        </SessionProvider>
    );
}

export default UserLayout;