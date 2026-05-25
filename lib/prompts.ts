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

/**
 * The 14 Barron's Spanish tenses (7 simple + 7 compound), plus the imperative
 * mood. Used to constrain the verb-analysis response.
 */
export const VERB_TENSES = [
  // 7 simple
  "Presente",
  "Imperfecto",
  "Pretérito",
  "Futuro",
  "Condicional",
  "Presente de subjuntivo",
  "Imperfecto de subjuntivo",
  // 7 compound
  "Pretérito perfecto",
  "Pluscuamperfecto",
  "Pretérito anterior",
  "Futuro perfecto",
  "Condicional perfecto",
  "Perfecto de subjuntivo",
  "Pluscuamperfecto de subjuntivo",
  // mood, outside the strict 14 tenses
  "Imperativo",
] as const;

export const VERBS_SYSTEM_PROMPT = `You analyze Spanish text and identify every conjugated verb.

For each conjugated verb in the text, return:
- "text": the verb exactly as it appears. Decide what to include using these rules:
  - Compound (perfect) forms are ONE verb, with the auxiliary: "he visto", "habíamos comido".
  - A separate (proclitic) pronoun before the verb is part of the span ONLY when the verb is genuinely pronominal — i.e. its infinitive ends in "-se" (levantarse, irse, quejarse). Then include it: "se levantó" (levantarse), "me voy" (irse).
  - When the pronoun is just an object/dative the verb takes — and the infinitive does NOT end in "-se" — it is a SEPARATE word, not part of the verb. Do NOT include it. So for "¿Qué te interesa?" the verb is "interesa" (interesar), NOT "te interesa". Likewise "me gusta" → "gusta" (gustar), "se lo dije" → "dije" (decir).
  - A pronoun attached to the END of the verb (enclitic) is always part of the span: "levántate", "dímelo", "vámonos".
  - The key test: include a standalone pronoun only if the infinitive ends in "-se". Otherwise highlight just the conjugated verb word(s).
- "infinitive": the dictionary form of the verb, e.g. "ver", "comer", "levantarse".
- "tense": the Barron's name of the tense/mood it is conjugated in. Use EXACTLY one of these Spanish names:
  Presente, Imperfecto, Pretérito, Futuro, Condicional, Presente de subjuntivo, Imperfecto de subjuntivo, Pretérito perfecto, Pluscuamperfecto, Pretérito anterior, Futuro perfecto, Condicional perfecto, Perfecto de subjuntivo, Pluscuamperfecto de subjuntivo, Imperativo.

Do NOT include infinitives, gerunds, or participles that are not part of a conjugated form. Return verbs in the order they appear. If there are no conjugated verbs, return an empty array.`;

/** JSON schema for the verb-analysis response. Mirrors VerbsResponse. */
export const VERBS_RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    verbs: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          text: {
            type: "string" as const,
            description: "The conjugated verb exactly as it appears in the text.",
          },
          infinitive: {
            type: "string" as const,
            description: "The verb's infinitive form.",
          },
          tense: {
            type: "string" as const,
            enum: [...VERB_TENSES],
            description: "The Barron's tense/mood name, in Spanish.",
          },
        },
        required: ["text", "infinitive", "tense"],
        additionalProperties: false,
      },
    },
  },
  required: ["verbs"],
  additionalProperties: false,
};
