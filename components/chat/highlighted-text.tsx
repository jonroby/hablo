"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { VerbSpan } from "@/lib/types";

/**
 * Renders `text` with each verb span highlighted. Hovering or tapping a verb
 * reveals its tense and infinitive in a popover. Spans are assumed sorted and
 * non-overlapping (as produced by the verbs API).
 */
export function HighlightedText({
  text,
  verbs,
}: {
  text: string;
  verbs: VerbSpan[];
}) {
  const segments: React.ReactNode[] = [];
  let cursor = 0;

  verbs.forEach((verb, i) => {
    if (verb.start > cursor) {
      segments.push(text.slice(cursor, verb.start));
    }
    segments.push(<VerbMark key={i} verb={verb} />);
    cursor = verb.end;
  });
  if (cursor < text.length) segments.push(text.slice(cursor));

  return <>{segments}</>;
}

function VerbMark({ verb }: { verb: VerbSpan }) {
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
        <span className="font-medium">{verb.tense}</span>
        <span className="text-muted-foreground">{verb.infinitive}</span>
      </PopoverContent>
    </Popover>
  );
}
