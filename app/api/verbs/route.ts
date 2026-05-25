import Anthropic from "@anthropic-ai/sdk";
import { VERBS_SYSTEM_PROMPT, VERBS_RESPONSE_SCHEMA } from "@/lib/prompts";
import type { VerbsRequest, VerbSpan } from "@/lib/types";

const client = new Anthropic();

/** What the model returns per verb — offsets are resolved server-side. */
interface RawVerb {
  text: string;
  infinitive: string;
  tense: string;
}

/**
 * Resolve each verb to its character offsets in `text`, scanning left to
 * right so repeated verbs map to distinct, non-overlapping spans. Verbs the
 * model reports but that can't be found in the text are dropped.
 */
function locateVerbs(text: string, raw: RawVerb[]): VerbSpan[] {
  const spans: VerbSpan[] = [];
  let cursor = 0;

  for (const verb of raw) {
    const start = text.indexOf(verb.text, cursor);
    if (start === -1) continue;
    const end = start + verb.text.length;
    spans.push({ ...verb, start, end });
    cursor = end;
  }

  return spans;
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as VerbsRequest;

  if (typeof text !== "string" || text.trim().length === 0) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: VERBS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
      output_config: {
        format: { type: "json_schema", schema: VERBS_RESPONSE_SCHEMA },
      },
    });

    const body = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const { verbs = [] } = JSON.parse(body) as { verbs?: RawVerb[] };

    return Response.json({ verbs: locateVerbs(text, verbs) });
  } catch {
    return Response.json({ error: "verbs_failed" }, { status: 500 });
  }
}
