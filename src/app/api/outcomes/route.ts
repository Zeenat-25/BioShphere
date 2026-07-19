import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { outcomes } from "@/db/schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const rows = await db
    .select()
    .from(outcomes)
    .where(eq(outcomes.userId, session.user.id))
    .orderBy(desc(outcomes.createdAt));

  return Response.json({ outcomes: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const body = (await req.json()) as {
    productName?: string;
    crop?: string;
    dateApplied?: string;
    cropCondition?: string;
    yieldImprovementPct?: number | null;
    notes?: string;
    farmerFeedback?: string;
  };

  if (!body.productName || !body.dateApplied || !body.cropCondition) {
    return Response.json({ error: "productName, dateApplied and cropCondition are required." }, { status: 400 });
  }

  const row = {
    id: crypto.randomUUID(),
    userId: session.user.id,
    productName: body.productName,
    crop: body.crop || null,
    dateApplied: body.dateApplied,
    cropCondition: body.cropCondition,
    yieldImprovementPct: body.yieldImprovementPct ?? null,
    notes: body.notes || null,
    farmerFeedback: body.farmerFeedback || null,
    createdAt: new Date().toISOString(),
  };

  await db.insert(outcomes).values(row);

  return Response.json({ outcome: row }, { status: 201 });
}
