import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    image: string;
    avatarColor: string;
    access_token: string;
}

interface IUserPagination {
    id: string;
    avatarColor: string;
    bio: string;
    email: string;
    username: string;
    codeExpired: string;
    isActive: boolean;
    role: string;
    createdAt: Date;
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
        access_expire: number;
        error: string;
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: IUser;
        access_token: string;
        refresh_token: string;
        access_expire: number;
        error: string;
    }
}
