import { describe, expect, test } from "bun:test";
import {
  PHRASES,
  CORRELATIVE_PHRASES,
  findPhrases,
  type PhraseSpan,
} from "@/lib/phrases";
import { dropOverlaps } from "@/lib/spans";

/** The phrase strings matched in a text, in order, after overlap resolution. */
function matched(text: string): string[] {
  return dropOverlaps(findPhrases(text)).map((m) => m.phrase);
}

describe("findPhrases — basic matching", () => {
  test("finds nothing in text with no stock phrases", () => {
    expect(findPhrases("El gato come pescado fresco.")).toEqual([]);
  });

  test("finds nothing in an empty string", () => {
    expect(findPhrases("")).toEqual([]);
  });

  test("finds a single phrase", () => {
    expect(matched("Sin embargo, llueve.")).toEqual(["sin embargo"]);
  });

  test("finds multiple distinct phrases in one sentence", () => {
    expect(matched("Por lo tanto, hay que esperar.")).toEqual([
      "por lo tanto",
      "hay que",
    ]);
  });

  test("finds the same phrase twice", () => {
    const found = findPhrases("A veces sí, a veces no.");
    expect(found.filter((f) => f.phrase === "a veces")).toHaveLength(2);
  });
});

describe("findPhrases — case and accent insensitivity", () => {
  test("matches regardless of capitalization", () => {
    expect(matched("SIN EMBARGO, vale.")).toEqual(["sin embargo"]);
    expect(matched("Sin Embargo, vale.")).toEqual(["sin embargo"]);
  });

  test("matches when the user omits accents", () => {
    // stored "quizás"; user typed "quizas".
    expect(matched("Quizas venga.")).toEqual(["quizás"]);
  });

  test("matches an accented phrase written correctly", () => {
    expect(matched("Lo hizo por sí solo.")).toEqual(["por sí solo"]);
  });

  test("returns the text exactly as it appears, not the canonical form", () => {
    const [m] = findPhrases("SIN EMBARGO");
    expect(m.text).toBe("SIN EMBARGO");
    expect(m.phrase).toBe("sin embargo");
  });
});

describe("findPhrases — offsets", () => {
  test("offsets index the original string, even past accents", () => {
    const text = "Lo hizo por sí solo, sin duda.";
    const span = findPhrases(text).find((m) => m.phrase === "por sí solo")!;
    expect(text.slice(span.start, span.end)).toBe("por sí solo");
  });

  test("text slice always equals the reported match text", () => {
    const text = "A pesar de que llueve, salgo después de comer.";
    for (const m of findPhrases(text)) {
      expect(text.slice(m.start, m.end)).toBe(m.text);
    }
  });
});

describe("findPhrases — word boundaries", () => {
  test("does not match a phrase glued inside a longer word", () => {
    // "a ver" must not match inside "la verdad".
    expect(matched("Ni idea, la verdad.")).not.toContain("a ver");
  });

  test("matches a short phrase at the start of the string", () => {
    expect(matched("A ver qué pasa.")).toContain("a ver");
  });

  test("matches a phrase bounded by punctuation", () => {
    expect(matched("¿De una? Vale.")).toContain("de una");
  });

  test("does not match across a word boundary mid-word at the end", () => {
    // "dar con" should not match inside "darconfiar"-like glue (synthetic).
    expect(findPhrases("Voy a darconazo")).toEqual([]);
  });

  test("matches a phrase surrounded by spaces mid-sentence", () => {
    expect(matched("Es la pura vida aquí.")).toContain("pura vida");
  });
});

describe("findPhrases — overlap resolution via dropOverlaps", () => {
  test("longer substring phrase wins over the shorter", () => {
    // "a pesar de que" beats "a pesar de".
    expect(matched("A pesar de que llueve.")).toContain("a pesar de que");
    expect(matched("A pesar de que llueve.")).not.toContain("a pesar de");
  });

  test("shorter phrase still matches when the longer is absent", () => {
    expect(matched("A pesar de la lluvia.")).toContain("a pesar de");
  });

  test("nested idiom: longer citation form wins", () => {
    expect(matched("Quiero darse cuenta de todo.")).toContain(
      "darse cuenta de",
    );
    expect(matched("Quiero darse cuenta de todo.")).not.toContain(
      "darse cuenta",
    );
  });

  test("standalone short idiom matches alone", () => {
    expect(matched("Ni idea, en serio.")).toContain("ni idea");
  });
});

describe("findPhrases — conjugation boundary (verb rule's job, not ours)", () => {
  test("does not match a conjugated form of an infinitive citation phrase", () => {
    // "tener que" stored as infinitive; "tengo que" is conjugated -> no match.
    expect(matched("Tengo que irme.")).not.toContain("tener que");
    // "tener sueño" likewise should not match "tengo sueño".
    expect(matched("Tengo sueño.")).not.toContain("tener sueño");
  });
});

describe("PHRASES data integrity", () => {
  test("has a substantial number of entries", () => {
    expect(PHRASES.length).toBeGreaterThan(400);
  });

  test("contains no duplicate phrases", () => {
    const counts = new Map<string, number>();
    for (const { phrase } of PHRASES) {
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
    const dupes = [...counts].filter(([, n]) => n > 1).map(([p]) => p);
    expect(dupes).toEqual([]);
  });

  test("every phrase is stored lowercase (canonical form)", () => {
    const notLower = PHRASES.filter((p) => p.phrase !== p.phrase.toLowerCase());
    expect(notLower).toEqual([]);
  });

  test("no entry contains a discontinuous '...' placeholder", () => {
    const withEllipsis = PHRASES.filter((p) => p.phrase.includes("..."));
    expect(withEllipsis).toEqual([]);
  });

  test("every phrase has a non-empty meaning", () => {
    const missing = PHRASES.filter((p) => !p.meaning.trim());
    expect(missing).toEqual([]);
  });

  test("no phrase has leading/trailing whitespace", () => {
    const padded = PHRASES.filter((p) => p.phrase !== p.phrase.trim());
    expect(padded).toEqual([]);
  });

  test("every stored phrase actually matches itself", () => {
    // guards against an entry that could never fire (e.g. internal odd chars).
    for (const { phrase } of PHRASES) {
      const found = findPhrases(phrase);
      expect(found.some((m) => m.phrase === phrase)).toBe(true);
    }
  });
});

describe("CORRELATIVE_PHRASES", () => {
  test("are kept out of the matched list (not yet matched)", () => {
    // they live separately and contain '...', so should never be in PHRASES.
    const phraseSet = new Set(PHRASES.map((p) => p.phrase));
    for (const { phrase } of CORRELATIVE_PHRASES) {
      expect(phraseSet.has(phrase)).toBe(false);
    }
  });

  test("all use the '...' discontinuity placeholder", () => {
    for (const { phrase } of CORRELATIVE_PHRASES) {
      expect(phrase).toContain("...");
    }
  });
});

describe("findPhrases — realistic conversational sentence", () => {
  test("highlights the expected phrases and nothing spurious", () => {
    const text =
      "Pues nada, tengo sueño y me da igual. Qué va, no pasa nada, ya te digo.";
    const result: PhraseSpan[] = dropOverlaps(findPhrases(text));
    const phrases = result.map((m) => m.phrase);
    expect(phrases).toEqual([
      "pues nada",
      "me da igual",
      "qué va",
      "no pasa nada",
      "ya te digo",
    ]);
    // "tengo sueño" is conjugated, so "tener sueño" must NOT appear.
    expect(phrases).not.toContain("tener sueño");
  });
});
