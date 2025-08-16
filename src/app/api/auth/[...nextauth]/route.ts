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
          console.log("Giriş yapılan kullanıcı:", {
            username: user.username,
            role: user.role,
            id: user.id
          });
          
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
        // İlk girişte user'dan role'ü al
        (token as any).role = (user as any).role;
        console.log("JWT callback - User'dan role alındı:", (user as any).role);
      }
      
      // Sonraki isteklerde token'dan role'ü koru
      // Eğer token'da role yoksa, user'dan al
      if (!(token as any).role && user) {
        (token as any).role = (user as any).role;
      }
      
      console.log("JWT callback - Token role:", (token as any).role);
      
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
        
        console.log("Session callback - Token:", token);
        console.log("Session callback - Token role:", (token as any).role);
        console.log("Session callback - Session user:", session.user);
        console.log("Session callback - Session user role:", (session.user as any).role);
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
