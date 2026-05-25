import { describe, expect, test } from "bun:test";
import { dropOverlaps, type Span } from "@/lib/spans";

/** Compact helper for readable cases. */
const s = (start: number, end: number): Span => ({ start, end });

describe("dropOverlaps", () => {
  test("returns an empty array unchanged", () => {
    expect(dropOverlaps([])).toEqual([]);
  });

  test("keeps a single span", () => {
    expect(dropOverlaps([s(2, 5)])).toEqual([s(2, 5)]);
  });

  test("keeps disjoint spans in order", () => {
    expect(dropOverlaps([s(0, 3), s(5, 8), s(10, 12)])).toEqual([
      s(0, 3),
      s(5, 8),
      s(10, 12),
    ]);
  });

  test("sorts out-of-order input by start", () => {
    expect(dropOverlaps([s(10, 12), s(0, 3), s(5, 8)])).toEqual([
      s(0, 3),
      s(5, 8),
      s(10, 12),
    ]);
  });

  test("adjacent spans (end == next.start) do not overlap", () => {
    // a span ending at 3 and one starting at 3 are back-to-back, both kept.
    expect(dropOverlaps([s(0, 3), s(3, 6)])).toEqual([s(0, 3), s(3, 6)]);
  });

  test("drops a span overlapping an earlier kept one", () => {
    expect(dropOverlaps([s(0, 5), s(3, 8)])).toEqual([s(0, 5)]);
  });

  test("on equal start, the longer span wins (substring case)", () => {
    // models "a pesar de" (0,10) vs "a pesar de que" (0,14): longer kept.
    const short = { start: 0, end: 10, id: "short" };
    const long = { start: 0, end: 14, id: "long" };
    expect(dropOverlaps([short, long])).toEqual([long]);
    // order in the input must not change the winner.
    expect(dropOverlaps([long, short])).toEqual([long]);
  });

  test("longer-start-wins then suppresses the nested shorter span", () => {
    // "darse cuenta de" (0,15) swallows "darse cuenta" (0,12).
    expect(dropOverlaps([s(0, 12), s(0, 15)])).toEqual([s(0, 15)]);
  });

  test("a long early span suppresses multiple later overlappers", () => {
    expect(dropOverlaps([s(0, 10), s(2, 4), s(6, 9), s(11, 13)])).toEqual([
      s(0, 10),
      s(11, 13),
    ]);
  });

  test("partial overlap: first kept, overlapper dropped, later disjoint kept", () => {
    expect(dropOverlaps([s(0, 5), s(4, 9), s(9, 12)])).toEqual([
      s(0, 5),
      s(9, 12),
    ]);
  });

  test("does not mutate the input array", () => {
    const input = [s(10, 12), s(0, 3)];
    const copy = [...input];
    dropOverlaps(input);
    expect(input).toEqual(copy);
  });

  test("preserves extra fields on kept spans", () => {
    const spans = [
      { start: 0, end: 3, label: "a" },
      { start: 1, end: 2, label: "b" },
    ];
    expect(dropOverlaps(spans)).toEqual([{ start: 0, end: 3, label: "a" }]);
  });

  test("equal start and equal end: keeps the first in input order", () => {
    // duplicate ranges from two rules — stable sort keeps the earlier one.
    const a = { start: 0, end: 4, rule: "verbs" };
    const b = { start: 0, end: 4, rule: "phrases" };
    expect(dropOverlaps([a, b])).toEqual([a]);
  });
});
