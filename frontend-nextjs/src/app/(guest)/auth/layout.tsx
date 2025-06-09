import { AntdRegistry } from "@ant-design/nextjs-registry";

const AuthLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <AntdRegistry>
            <div style={{ display: "flex", gap: "20px", minHeight: "100vh" }}>
                <main style={{ width: "100%"}}>{children}</main>
            </div>
        </AntdRegistry>

    );
};

export default AuthLayout;
