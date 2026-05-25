import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findPhrases, type PhraseSpan } from "@/lib/phrases";
import type { HighlightRule, MarkProps } from "@/components/chat/rules/types";

/** A highlighted stock phrase whose popover shows its English meaning. */
function PhraseMark({ span }: MarkProps<PhraseSpan>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded bg-sky-400/25 underline decoration-sky-500/70 decoration-dotted underline-offset-2 transition-colors hover:bg-sky-400/40"
        >
          {span.text}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-auto gap-1">
        <span className="font-medium">{span.phrase}</span>
        <span className="text-muted-foreground">{span.meaning}</span>
      </PopoverContent>
    </Popover>
  );
}

/** Flags hardcoded stock phrases / connectors (local, no API call). */
export const phrasesRule: HighlightRule<PhraseSpan> = {
  id: "phrases",
  analyze: (text) => findPhrases(text),
  Mark: PhraseMark,
};
