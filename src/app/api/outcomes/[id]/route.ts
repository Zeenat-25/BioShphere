import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { outcomes } from "@/db/schema";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  await db.delete(outcomes).where(and(eq(outcomes.id, id), eq(outcomes.userId, session.user.id)));

  return Response.json({ ok: true });
}
