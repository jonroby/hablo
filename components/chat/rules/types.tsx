import type { ComponentType, ReactNode } from "react";
import type { TenseName } from "@/lib/prompts";

/** A located highlight within a message, shared by every rule. */
export interface HighlightSpan {
  /** Character offset of the highlight within the message (inclusive). */
  start: number;
  /** Character offset just past the highlight within the message. */
  end: number;
  /** The text exactly as it appears in the message. */
  text: string;
}

/**
 * What a Mark can ask the bubble to show in the shared info sheet. Rules with
 * no extra detail simply never call `onShowInfo`.
 */
export type InfoRequest = { kind: "tense"; tense: TenseName };

/** Props every rule's Mark component receives. */
export interface MarkProps<S extends HighlightSpan> {
  span: S;
  /** Opens the shared info sheet with rule-supplied content. */
  onShowInfo: (info: InfoRequest) => void;
}

/**
 * A self-contained highlight rule: how to find its spans in a message, and how
 * to render each one (color + popover live inside the Mark). `analyze` may be
 * sync or async — verb tagging hits an API, phrase matching is local. The span
 * type S is private to each rule; the registry sees only the erased Rule below.
 */
export interface HighlightRule<S extends HighlightSpan = HighlightSpan> {
  id: string;
  analyze: (text: string) => S[] | Promise<S[]>;
  Mark: ComponentType<MarkProps<S>>;
}

/** A located span already paired with how to render it. */
export interface RenderableSpan {
  start: number;
  end: number;
  render: (onShowInfo: (info: InfoRequest) => void) => ReactNode;
}

/**
 * A rule with its span type erased: it knows how to turn `text` into renderable
 * spans, so a registry can hold many rules with different span types together.
 */
export interface Rule {
  id: string;
  run: (text: string) => Promise<RenderableSpan[]>;
}

/** Seal a typed rule's span type behind the uniform Rule interface. */
export function defineRule<S extends HighlightSpan>(
  rule: HighlightRule<S>,
): Rule {
  const { id, analyze, Mark } = rule;
  return {
    id,
    run: async (text) => {
      const spans = await analyze(text);
      return spans.map((span) => ({
        start: span.start,
        end: span.end,
        render: (onShowInfo) => <Mark span={span} onShowInfo={onShowInfo} />,
      }));
    },
  };
}
