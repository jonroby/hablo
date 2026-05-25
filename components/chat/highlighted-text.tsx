"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TenseName } from "@/lib/prompts";
import type { VerbSpan } from "@/lib/types";

/**
 * Renders `text` with each verb span highlighted. Hovering or tapping a verb
 * reveals its tense and infinitive in a popover; clicking the tense calls
 * `onTenseClick`. Spans are assumed sorted and non-overlapping (as produced by
 * the verbs API).
 */
export function HighlightedText({
  text,
  verbs,
  onTenseClick,
}: {
  text: string;
  verbs: VerbSpan[];
  onTenseClick: (tense: TenseName) => void;
}) {
  const segments: React.ReactNode[] = [];
  let cursor = 0;

  verbs.forEach((verb, i) => {
    if (verb.start > cursor) {
      segments.push(text.slice(cursor, verb.start));
    }
    segments.push(<VerbMark key={i} verb={verb} onTenseClick={onTenseClick} />);
    cursor = verb.end;
  });
  if (cursor < text.length) segments.push(text.slice(cursor));

  return <>{segments}</>;
}

/** A highlighted verb whose popover reveals its tense and infinitive. */
function VerbMark({
  verb,
  onTenseClick,
}: {
  verb: VerbSpan;
  onTenseClick: (tense: TenseName) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded bg-amber-400/25 underline decoration-amber-500/70 decoration-dotted underline-offset-2 transition-colors hover:bg-amber-400/40"
        >
          {verb.text}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-auto gap-1">
        <TenseLabel
          tense={verb.tense}
          onClick={() => onTenseClick(verb.tense)}
        />
        <span className="text-muted-foreground">{verb.infinitive}</span>
      </PopoverContent>
    </Popover>
  );
}

/** The tense name as a button that opens its explainer. */
function TenseLabel({
  tense,
  onClick,
}: {
  tense: TenseName;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 font-medium underline-offset-2 hover:underline"
    >
      {tense}
      <Info className="size-3.5 text-muted-foreground" />
    </button>
  );
}
