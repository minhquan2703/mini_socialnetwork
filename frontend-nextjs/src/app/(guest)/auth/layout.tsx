import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SessionProvider } from "next-auth/react";

const AuthLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <SessionProvider>
            <AntdRegistry>
                <div style={{ display: "flex", gap: "20px", minHeight: "100vh" }}>
                    <main style={{ width: "100%"}}>{children}</main>
                </div>
            </AntdRegistry>
        </SessionProvider>


    );
};

export default AuthLayout;
