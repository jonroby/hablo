import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a friendly Spanish conversation partner helping the user practice.

The user writes in English or imperfect Spanish. For each user turn you do two things:
1. "translation": rewrite what the user said as correct, natural Spanish (this replaces their original text).
2. "reply": respond to them conversationally in Spanish, keeping the conversation flowing. Match their level — keep it simple if they write simply. Be warm, never pedantic.

The conversation history you receive contains the user's already-translated Spanish messages and your prior Spanish replies.`;

const RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    translation: {
      type: "string" as const,
      description: "The user's message rewritten as correct, natural Spanish.",
    },
    reply: {
      type: "string" as const,
      description: "A conversational reply to the user, in Spanish.",
    },
  },
  required: ["translation", "reply"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
      output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const parsed = JSON.parse(text) as { translation: string; reply: string };

    return Response.json(parsed);
  } catch {
    return Response.json({ error: "chat_failed" }, { status: 500 });
  }
}
