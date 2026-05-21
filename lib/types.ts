export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

/** A message as sent to the chat API — no client-only fields like `id`. */
export interface ChatTurn {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: ChatTurn[];
}

export interface ChatResponse {
  /** The user's latest message rewritten as correct, natural Spanish. */
  translation: string;
  /** A conversational reply to the user, in Spanish. */
  reply: string;
}
