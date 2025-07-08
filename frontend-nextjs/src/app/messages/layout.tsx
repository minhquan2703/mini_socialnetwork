import { auth } from "@/auth";
import MessagesContent from "@/components/layout/messages/messages.content";
import MessagesHeader from "@/components/layout/messages/messages.header";
import MessagesSideBar from "@/components/layout/messages/messages.sidebar";
import { MessagesContextProvider } from "@/library/user.messages.context";
import { SessionProvider } from "@/library/session.context";
import { SocketProvider } from "@/library/socket.context";
import MessagesDetail from "@/components/layout/messages/messages.detail";

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
                    <div style={{ display: "flex", gap: "5px" }}>
                        <div
                            className="left"
                            style={{ width: "23%", height: "calc(100vh-30px)" }}
                        >
                            <MessagesSideBar />
                        </div>
                        <div
                            className="right-side"
                            style={{
                                width: "75%",
                                height: "calc(100vh-30px)",
                            }}
                        >
                            <div style={{ height: "55px" }}>
                                <MessagesHeader />
                            </div>
                            <div
                                className="chatbox"
                                style={{
                                    display: "flex",
                                    marginTop: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "65%",
                                    }}
                                >
                                    <MessagesContent>
                                        {children}
                                    </MessagesContent>
                                </div>
                                <div
                                    style={{
                                        width: "35%",
                                    }}
                                >
                                    <MessagesDetail />
                                </div>
                            </div>
                        </div>
                    </div>
                </MessagesContextProvider>
            </SocketProvider>
        </SessionProvider>
    );
};

export default MessagesLayout;
