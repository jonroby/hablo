"use client";

import type { RenderableSpan, InfoRequest } from "@/components/chat/rules";

/**
 * Renders `text` with each span replaced by its rule's Mark. Spans are assumed
 * sorted and non-overlapping (as produced by runRules). This component only
 * stitches text and marks together — each Mark owns its own color and popover.
 */
export function HighlightedText({
  text,
  spans,
  onShowInfo,
}: {
  text: string;
  spans: RenderableSpan[];
  onShowInfo: (info: InfoRequest) => void;
}) {
  const segments: React.ReactNode[] = [];
  let cursor = 0;

  spans.forEach((span, i) => {
    if (span.start > cursor) {
      segments.push(text.slice(cursor, span.start));
    }
    segments.push(
      <span key={i}>{span.render(onShowInfo)}</span>,
    );
    cursor = span.end;
  });
  if (cursor < text.length) segments.push(text.slice(cursor));

  return <>{segments}</>;
}
