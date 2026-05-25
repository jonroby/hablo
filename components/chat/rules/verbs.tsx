import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { analyzeVerbs } from "@/lib/api";
import type { TenseName } from "@/lib/prompts";
import type { VerbSpan } from "@/lib/types";
import type { HighlightRule, MarkProps } from "@/components/chat/rules/types";

/** A highlighted verb whose popover reveals its tense and infinitive. */
function VerbMark({ span, onShowInfo }: MarkProps<VerbSpan>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded bg-amber-400/25 underline decoration-amber-500/70 decoration-dotted underline-offset-2 transition-colors hover:bg-amber-400/40"
        >
          {span.text}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-auto gap-1">
        <TenseLabel
          tense={span.tense}
          onClick={() => onShowInfo({ kind: "tense", tense: span.tense })}
        />
        <span className="text-muted-foreground">{span.infinitive}</span>
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

/** Tags conjugated verbs with their Barron's tense (via the verbs API). */
export const verbsRule: HighlightRule<VerbSpan> = {
  id: "verbs",
  analyze: async (text) => (await analyzeVerbs({ text })).verbs,
  Mark: VerbMark,
};
