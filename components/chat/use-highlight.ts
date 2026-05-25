"use client";

import { useCallback, useState } from "react";
import { runRules, type RenderableSpan } from "@/components/chat/rules";

/**
 * Owns highlight state for a single message's `text`. Turning it on runs every
 * highlight rule (verbs, stock phrases, …) and waits for all of them before
 * showing anything — verbs hit an API, phrases are local. The merged result is
 * cached, so toggling off then on again is instant.
 */
export function useHighlight(text: string) {
  const [spans, setSpans] = useState<RenderableSpan[] | null>(null);
  const [cache, setCache] = useState<RenderableSpan[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (isLoading) return;

    if (spans !== null) {
      setSpans(null);
      return;
    }

    if (cache !== null) {
      setSpans(cache);
      return;
    }

    setIsLoading(true);
    try {
      const found = await runRules(text);
      setCache(found);
      setSpans(found);
    } catch {
      // Leave highlighting off; the button returns to its idle state.
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, spans, cache, text]);

  return { spans, isLoading, active: spans !== null, toggle };
}
