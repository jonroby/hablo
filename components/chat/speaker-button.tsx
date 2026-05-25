"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/components/chat/use-speech";

/** An icon button that reads the given Spanish text aloud. */
export function SpeakerButton({ text }: { text: string }) {
  const { speak, isSpeaking, supported } = useSpeech();

  if (!supported) return null;

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={isSpeaking ? "Detener" : "Escuchar"}
      title={isSpeaking ? "Detener" : "Escuchar"}
      onClick={() => speak(text)}
      className="text-muted-foreground opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100"
    >
      {isSpeaking ? <VolumeX /> : <Volume2 />}
    </Button>
  );
}
