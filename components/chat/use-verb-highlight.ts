"use client";

import { useCallback, useState } from "react";
import { analyzeVerbs } from "@/lib/api";
import type { VerbSpan } from "@/lib/types";

/**
 * Owns verb-highlight state for a single message's `text`. The first time it's
 * turned on it asks the verbs API to locate and tag the verbs, then caches the
 * result; toggling off hides the highlight without discarding the cache.
 */
export function useVerbHighlight(text: string) {
  const [verbs, setVerbs] = useState<VerbSpan[] | null>(null);
  const [cache, setCache] = useState<VerbSpan[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (isLoading) return;

    if (verbs !== null) {
      setVerbs(null);
      return;
    }

    if (cache !== null) {
      setVerbs(cache);
      return;
    }

    setIsLoading(true);
    try {
      const { verbs: found } = await analyzeVerbs({ text });
      setCache(found);
      setVerbs(found);
    } catch {
      // Leave the highlight off; the button returns to its idle state.
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, verbs, cache, text]);

  return { verbs, isLoading, active: verbs !== null, toggle };
}
