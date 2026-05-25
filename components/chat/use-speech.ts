"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Subscribe to the browser's voice list, which loads asynchronously. */
function subscribeVoices(callback: () => void): () => void {
  const synth = window.speechSynthesis;
  if (!synth) return () => {};
  synth.addEventListener("voiceschanged", callback);
  return () => synth.removeEventListener("voiceschanged", callback);
}

// useSyncExternalStore requires a stable snapshot reference, but getVoices()
// returns a fresh array each call. Cache it and only swap when the list
// actually changes (its length/contents), so React doesn't loop forever.
const NO_VOICES: SpeechSynthesisVoice[] = [];
let cachedVoices: SpeechSynthesisVoice[] = NO_VOICES;

function getVoices(): SpeechSynthesisVoice[] {
  const next = window.speechSynthesis?.getVoices() ?? NO_VOICES;
  const changed =
    next.length !== cachedVoices.length ||
    next.some((v, i) => v !== cachedVoices[i]);
  if (changed) cachedVoices = next;
  return cachedVoices;
}

function getServerVoices(): SpeechSynthesisVoice[] {
  return NO_VOICES;
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return voices.find((v) => v.lang.toLowerCase().startsWith("es"));
}

/**
 * Speaks text aloud via the browser's SpeechSynthesis API, preferring a
 * Spanish voice. Tracks which text is currently playing so a single hook
 * instance can drive one button.
 */
export function useSpeech() {
  const voices = useSyncExternalStore(subscribeVoices, getVoices, getServerVoices);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Cancel any in-flight speech if the component goes away.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;

      const synth = window.speechSynthesis;
      // Toggle off if this instance is already speaking.
      if (synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      const voice = pickSpanishVoice(voices);
      if (voice) utterance.voice = voice;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      setIsSpeaking(true);
      synth.speak(utterance);
    },
    [supported, voices],
  );

  return { speak, isSpeaking, supported };
}
