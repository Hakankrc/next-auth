import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser } from "@/lib/users";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = findUser(credentials.username, credentials.password);
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          } as any;
        }

        return null;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        (token as any).accessToken = (account as any).access_token;
      }
      if (profile) {
        (token as any).id = (profile as any).sub;
      }
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      if (!(token as any).role && user) {
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        if ((token as any).id) {
          (session.user as { id?: string; role?: string }).id = (token as any).id as string;
        }
        if ((token as any).role) {
          (session.user as { id?: string; role?: string }).role = (token as any).role as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};


