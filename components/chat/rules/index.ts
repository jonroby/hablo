import { phrasesRule } from "@/components/chat/rules/phrases";
import { verbsRule } from "@/components/chat/rules/verbs";
import {
  defineRule,
  type InfoRequest,
  type RenderableSpan,
  type Rule,
} from "@/components/chat/rules/types";
import { dropOverlaps } from "@/lib/spans";

/** Every highlight rule the single highlight button runs, in priority order. */
export const RULES: Rule[] = [defineRule(verbsRule), defineRule(phrasesRule)];

/**
 * Run every rule over `text`, wait for all of them (all-or-nothing), then merge
 * their spans into one sorted, non-overlapping list. On overlap the earliest
 * (then longer) span wins; RULES order breaks remaining ties, so list
 * higher-priority rules first.
 */
export async function runRules(text: string): Promise<RenderableSpan[]> {
  const perRule = await Promise.all(RULES.map((rule) => rule.run(text)));
  return dropOverlaps(perRule.flat());
}

export type { InfoRequest, RenderableSpan };
