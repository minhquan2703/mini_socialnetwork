import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Social Media Mini",
    description: "Dự án cá nhân của Minh Quân",
    // viewport: "initial-scale=1, width=device-width",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <AntdRegistry>{children}</AntdRegistry>
                    <Toaster
                        visibleToasts={2}
                        position="top-center"
                        duration={2000}
                    />
                </SessionProvider>
            </body>
        </html>
    );
}
