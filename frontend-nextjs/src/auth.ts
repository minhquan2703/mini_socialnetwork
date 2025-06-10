import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ActiveAccountError, InvalidEmailPasswordError } from "./utils/errors";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths/login`,
                    body: {
                        username: credentials.username,
                        password: credentials.password,
                    },
                });
                if (+res.statusCode === 201) {
                    return {
                        id: res.data?.user?.id,
                        email: res.data?.user?.email,
                        username: res.data?.user?.username,
                        name: res.data?.user?.name,
                        role: res.data?.user?.role,
                        image: res.data?.user?.image,
                        access_token: res.data?.access_token,
                    };
                } else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                } else if (+res.statusCode === 400) {
                    throw new ActiveAccountError();
                } else {
                    throw new Error("Internal server error");
                }

                // return user object with their profile data
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token.user = user as IUser;
            }
            return token;
        },
        session({ session, token }) {
            // (session.user as IUser) = token.user;
            session.user = {
                id: token?.user?.id,
                email: token?.user?.email,
                username: token?.user?.username,
                name: token?.user?.name,
                role: token?.user?.role,
                image: token?.user?.image,
                access_token: token?.user?.access_token,
            };
            return session;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
});
