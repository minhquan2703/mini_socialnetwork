import { auth } from "@/auth";
import MessagesContent from "@/components/layout/messages/messages.content";
import MessagesHeader from "@/components/layout/messages/messages.header";
import MessagesSideBar from "@/components/layout/messages/messages.sidebar";
import { MessagesContextProvider } from "@/library/user.messages.context";
import { SessionProvider } from "@/library/session.context";
import { SocketProvider } from "@/library/socket.context";

const MessagesLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                <MessagesContextProvider>
                    <div style={{ display: "flex", width: "100%", overflow: "hidden" }}>
                        <div
                            className="left"
                            style={{ width: "25%", height: "100vh" }}
                        >
                            <MessagesSideBar />
                        </div>
                        <div
                            className="right-side"
                            style={{
                                width: "75%",
                                height: "100vh"
                            }}
                        >
                            <div style={{ height: "55px" }}>
                                <MessagesHeader />
                            </div>
                            <div
                                style={{
                                    height: "calc(100vh-55px)",
                                    width: "100%",
                                }}
                            >
                                <MessagesContent>{children}</MessagesContent>

                                {/* <div style={{width: "35%"}}>
                                    <MessagesDetail />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </MessagesContextProvider>
            </SocketProvider>
        </SessionProvider>
    );
};

export default MessagesLayout;
