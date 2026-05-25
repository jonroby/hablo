/** Anything occupying a character range, used by highlight matching. */
export interface Span {
  start: number;
  end: number;
}

/**
 * Sort spans by position and drop any that overlap an already-kept span.
 * Earliest start wins; ties go to the longer span, then to input order. The
 * input is not mutated.
 */
export function dropOverlaps<T extends Span>(spans: T[]): T[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || b.end - a.end);

  const kept: T[] = [];
  let cursor = 0;
  for (const span of sorted) {
    if (span.start >= cursor) {
      kept.push(span);
      cursor = span.end;
    }
  }

  return kept;
}
