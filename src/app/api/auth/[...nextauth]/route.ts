import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser } from "@/lib/users";

const handler = NextAuth({
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

        // Kullanıcı kontrolü
        const user = findUser(credentials.username, credentials.password);
        
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
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
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.id = profile.sub;
      }
      if (user) {
        // İlk girişte user'dan id ve role'ü al
        token.id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      
      // Sonraki isteklerde token'dan role'ü koru
      // Eğer token'da role yoksa, user'dan al
      if (!(token as any).role && user) {
        (token as any).role = (user as any).role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // ID'yi aktar
        if (token.id) {
          (session.user as { id?: string; role?: string }).id = token.id as string;
        }
        
        // Role'ü aktar
        if ((token as any).role) {
          (session.user as { id?: string; role?: string }).role = (token as any).role as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
});

export { handler as GET, handler as POST };
