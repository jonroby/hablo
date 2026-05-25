export const CHAT_SYSTEM_PROMPT = `You are a friendly Spanish conversation partner helping the user practice.

The user writes in English or imperfect Spanish. For each user turn you do three things:
1. "translation": rewrite what the user said as correct, natural Spanish (this replaces their original text).
2. "reply": respond to them conversationally in Spanish, keeping the conversation flowing. Match their level — keep it simple if they write simply. Be warm, never pedantic.
3. "replyTranslation": a faithful English translation of "reply", so the learner can check what you said.

The conversation history you receive contains the user's already-translated Spanish messages and your prior Spanish replies.`;

/** JSON schema for the chat response. Mirrors the ChatResponse type. */
export const CHAT_RESPONSE_SCHEMA = {
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
    replyTranslation: {
      type: "string" as const,
      description: "The English translation of `reply`.",
    },
  },
  required: ["translation", "reply", "replyTranslation"],
  additionalProperties: false,
};
