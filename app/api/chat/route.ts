import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM_PROMPT, CHAT_RESPONSE_SCHEMA } from "@/lib/prompts";
import type { ChatRequest, ChatResponse } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages } = (await request.json()) as ChatRequest;

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
      system: CHAT_SYSTEM_PROMPT,
      messages: apiMessages,
      output_config: {
        format: { type: "json_schema", schema: CHAT_RESPONSE_SCHEMA },
      },
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const parsed = JSON.parse(text) as ChatResponse;

    return Response.json(parsed);
  } catch {
    return Response.json({ error: "chat_failed" }, { status: 500 });
  }
}
