import type { ChatRequest, ChatResponse } from "@/lib/types";

export async function sendChat(body: ChatRequest): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);

  return (await res.json()) as ChatResponse;
}
