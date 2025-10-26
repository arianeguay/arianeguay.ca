import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
      async authorize(credentials: any) {
        const adminEmail = process.env.AUTH_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const adminPassword = process.env.AUTH_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        const email = (credentials?.email ?? "").toString();
        const password = (credentials?.password ?? "").toString();
        if (!email || !password) return null;

        if (
          adminEmail &&
          adminPassword &&
          email.toLowerCase() === adminEmail.toLowerCase() &&
          password === adminPassword
        ) {
          return { id: "admin", email: adminEmail, name: "Admin" } as any;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email!;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
