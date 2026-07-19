import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (!user) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          experience: user.experience,
          farmName: user.farmName,
        };
      },
    }),
  ],
  callbacks: {
    // Runs on sign-in, and again whenever the client calls the `update()`
    // trigger (used by the onboarding page right after saving experience).
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.experience = (user as { experience?: string | null }).experience ?? null;
        token.farmName = (user as { farmName?: string | null }).farmName ?? null;
      }
      if (trigger === "update" && token.id) {
        const [fresh] = await db.select().from(users).where(eq(users.id, token.id as string)).limit(1);
        if (fresh) {
          token.experience = fresh.experience;
          token.name = fresh.name;
          token.farmName = fresh.farmName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.experience = (token.experience as string | null) ?? null;
        session.user.farmName = (token.farmName as string | null) ?? null;
      }
      return session;
    },
  },
});
