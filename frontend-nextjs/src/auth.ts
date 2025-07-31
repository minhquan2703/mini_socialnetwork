export const runtime = 'nodejs';

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { IUser } from "./types/next-auth";
import { sendRequest } from "./utils/apiAxios";
import { ActiveAccountError, InvalidEmailPasswordError, RateLimitError } from "./utils/errors";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
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
                        avatarColor: res.data?.user?.avatarColor,
                        access_token: res.data?.access_token,
                    };
                } else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                } else if (+res.statusCode === 400) {
                    throw new ActiveAccountError();
                } else if (+res.statusCode === 429) {
                    throw new RateLimitError()
                }
                else {
                    throw new Error("Internal server error");
                }
            },
        }),
        Credentials({
            id: "refresh-token-provider",
            credentials: {
                access_token: {},
            },
            authorize: async (credentials) => {

                const res = await sendRequest<IBackendRes<IUser>>({
                    method: "GET",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths/me`,
                    headers: {
                        Authorization: `Bearer ${credentials.access_token}`,
                    },
                });


                if (+res.statusCode === 200 && res.data) {
                    return {
                        id: res.data.id,
                        email: res.data.email,
                        username: res.data.username,
                        name: res.data.name,
                        role: res.data.role,
                        image: res.data.image,
                        avatarColor: res.data.avatarColor,
                        access_token: credentials.access_token,
                    };
                }
                return null;
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
                avatarColor: token?.user?.avatarColor,
                access_token: token?.user?.access_token,
                emailVerified: null,
            };
            return session;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
});
