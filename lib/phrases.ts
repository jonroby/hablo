export interface Phrase {
  /** The canonical Spanish phrase, lowercased and accented correctly. */
  phrase: string;
  /** A short English meaning shown in the popover. */
  meaning: string;
}

/**
 * Hardcoded stock phrases / connectors worth flagging for a learner. Matching
 * is case- and accent-insensitive (see normalize / findPhrases), so each entry
 * is stored once in its canonical lowercase, accented form. Grows over time.
 */
export const PHRASES: Phrase[] = [
  { phrase: "a pesar de", meaning: "in spite of, despite" },
  { phrase: "aunque", meaning: "although, even though" },
  { phrase: "sin embargo", meaning: "however, nevertheless" },
  { phrase: "hay que", meaning: "one must, it is necessary to" },
  { phrase: "tener que", meaning: "to have to" },
  { phrase: "por sí solo", meaning: "by itself, on its own" },
  { phrase: "en vez de", meaning: "instead of" },
  { phrase: "por lo tanto", meaning: "therefore, so" },
  { phrase: "en cuanto", meaning: "as soon as" },
];

/** A located phrase within a piece of text. */
export interface PhraseSpan extends Phrase {
  /** Character offset of the match within the text (inclusive). */
  start: number;
  /** Character offset just past the match within the text. */
  end: number;
  /** The phrase exactly as it appears in the text (original case/accents). */
  text: string;
}

/** Lowercase and strip diacritics so matching ignores case and accents. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Find every stock phrase in `text`, case- and accent-insensitively. May return
 * overlapping matches in arbitrary order — the caller resolves overlaps (see
 * dropOverlaps in runRules). NFD normalization preserves 1:1 character offsets
 * for Spanish text, so offsets map back onto the original string.
 */
export function findPhrases(text: string): PhraseSpan[] {
  const haystack = normalize(text);
  const found: PhraseSpan[] = [];

  for (const entry of PHRASES) {
    const needle = normalize(entry.phrase);
    let at = haystack.indexOf(needle);

    while (at !== -1) {
      found.push({
        ...entry,
        start: at,
        end: at + needle.length,
        text: text.slice(at, at + needle.length),
      });
      at = haystack.indexOf(needle, at + needle.length);
    }
  }

  return found;
}
