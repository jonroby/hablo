export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  /**
   * The alternate-language version revealed by the translation toggle:
   * the user's original English/input for user messages, the English
   * translation of the Spanish reply for assistant messages.
   */
  translation?: string;
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
  /** The English translation of `reply`. */
  replyTranslation: string;
}
