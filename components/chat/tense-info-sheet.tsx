"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TenseName } from "@/lib/prompts";
import { GROUP_LABEL, TENSE_INFO } from "@/lib/tenses";

/**
 * A right-side panel explaining a single tense, with stock examples. Open when
 * `tense` is set; calls `onOpenChange(false)` when dismissed. Reads its content
 * from the static TENSE_INFO reference.
 */
export function TenseInfoSheet({
  tense,
  onOpenChange,
}: {
  tense: TenseName | null;
  onOpenChange: (open: boolean) => void;
}) {
  const info = tense ? TENSE_INFO[tense] : null;

  return (
    <Sheet open={tense !== null} onOpenChange={onOpenChange} modal={false}>
      <SheetContent side="right" showOverlay={false} className="gap-0">
        {tense && info ? (
          <>
            <SheetHeader>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                {GROUP_LABEL[info.group]}
              </p>
              <SheetTitle className="text-lg">{tense}</SheetTitle>
              <SheetDescription className="leading-relaxed">
                {info.explainer}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-6">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Ejemplos
              </p>
              <ul className="flex flex-col gap-2">
                {info.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-lg bg-muted px-3 py-2 leading-relaxed"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
