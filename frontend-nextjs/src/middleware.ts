export { auth as middleware } from "@/auth";

// export const config = {
//   matcher: [
//     //chỉ áp dụng middleware cho các route này (không áp dụng cho static, API, login)
//     "/((?!_next/static|_next/image|favicon.ico|auth/login|api/public).*)"
//   ],
// };
export const config = {
    matcher: [
        // '/((?!auth).*)(.+)|/verify',
        // "/((?!api|_next/static|_next/image|favicon.ico|/|/auth).*)",
        "/((?!api|_next/static|_next/image|favicon.ico|auth|verify|$).*)",
    ],
};
