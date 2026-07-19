import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { experience } = (await req.json()) as { experience?: "beginner" | "experienced" };
  if (experience !== "beginner" && experience !== "experienced") {
    return Response.json({ error: "Invalid experience level." }, { status: 400 });
  }

  await db.update(users).set({ experience }).where(eq(users.id, session.user.id));

  return Response.json({ ok: true });
}
