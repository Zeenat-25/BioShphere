import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      experience: string | null;
      farmName: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    experience?: string | null;
    farmName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    experience?: string | null;
    farmName?: string | null;
  }
}
