// middleware.ts - THAY THẾ TOÀN BỘ FILE NÀY
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Nếu truy cập /dashboard
    if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }

        if (isLoggedIn && req.auth.user?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    if (isLoggedIn && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isLoggedIn && pathname.startsWith("/verify")) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    //các route khác vẫn cần đăng nhập (trừ auth pages)
    // if (!isLoggedIn && !pathname.startsWith("/auth") && pathname !== "/") {
    //     return NextResponse.redirect(new URL("/auth", req.url));
    // }
});

export const config = {
    matcher: [
        // Bảo vệ tất cả routes trừ static files và auth
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        // Đặc biệt bảo vệ dashboard
        "/dashboard/:path*",
    ],
};
