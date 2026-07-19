import { NextRequest } from "next/server";
import { textCompletion, hasOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = `You are the BioSphere AI assistant, embedded in an enterprise agricultural
intelligence platform. You help farmers, agronomists and advisors with:
- farming questions and crop guidance
- explaining weather and its impact on field operations
- biological product recommendations
- government agriculture schemes
- interpreting sensor readings (soil moisture, temperature, humidity)

Be concise, practical, and plain-spoken. Avoid hype. If you don't have enough
context (crop, region, growth stage), ask one clarifying question.`;

const FALLBACK =
  "I can help with weather, sensor readings, biological products, and government schemes once an OPENAI_API_KEY is configured on the server. In the meantime, check the Mission Control widgets for live simulated readings.";

export async function POST(req: NextRequest) {
  const { message, experience } = (await req.json()) as { message: string; experience?: string | null };

  if (!message || typeof message !== "string") {
    return Response.json({ reply: "Please include a question." }, { status: 400 });
  }

  const audienceNote =
    experience === "beginner"
      ? "The user is a beginner — explain plainly, avoid jargon, define any technical terms you use."
      : experience === "experienced"
        ? "The user is an experienced farmer — be technical and dense, skip basic definitions."
        : "";

  const reply = await textCompletion({
    system: `${SYSTEM_PROMPT}\n${audienceNote}`,
    user: message,
    fallback: FALLBACK,
  });

  return Response.json({ reply, live: hasOpenAI });
}
