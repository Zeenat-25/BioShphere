import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function POST(req: NextRequest) {
  const { name, email, password, farmName } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
    farmName?: string;
  };

  if (!name || !email || !password) {
    return Response.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [existing] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);

  await db.insert(users).values({
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash,
    farmName: farmName || null,
    experience: null,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
