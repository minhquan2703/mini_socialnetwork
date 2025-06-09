import UserSideBar from "@/components/layout/user/user.sidebar";
import UserHeader from "@/components/layout/user/user.header";
import UserContent from "@/components/layout/user/user.content";
import { UserContextProvider } from "@/library/user.context";
import { auth } from "@/auth";

const UserLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();
    return (
        <UserContextProvider>
            <div style={{ display: "flex" }}>
                <div
                    className="left-side"
                    style={{ minWidth: "80px" }}
                >
                    <UserSideBar session={session}/>
                </div>
                <div className="right-side" style={{ flex: 1 }}>
                    <UserHeader session={session}/>
                    <UserContent>{children}</UserContent>
                </div>
            </div>
        </UserContextProvider>
    );
}
export default UserLayout

// import UserSideBar from "@/components/layout/user/user.sidebar";
// import UserHeader from "@/components/layout/user/user.header";
// import UserContent from "@/components/layout/user/user.content";
// import { UserContextProvider } from "@/library/user.context";

// export default function UserLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <UserContextProvider>
//             <div style={{ 
//                 display: "flex",
//                 backgroundColor: "#F5F9F2",
//                 minHeight: "100vh"
//             }}>
//                 <div
//                     className="left-side"
//                     style={{ 
//                         minWidth: "80px",
//                         position: "relative"
//                     }}
//                 >
//                     <UserSideBar />
//                 </div>
//                 <div className="right-side" style={{ 
//                     flex: 1,
//                     position: "relative"
//                 }}>
//                     <UserHeader />
//                     <UserContent>{children}</UserContent>
//                 </div>
//             </div>
//         </UserContextProvider>
//     );
// }