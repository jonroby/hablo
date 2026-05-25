"use client";

import { Loader2, SpellCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** An icon button that toggles verb highlighting for a message. */
export function VerbToggle({
  active,
  isLoading,
  onToggle,
}: {
  active: boolean;
  isLoading: boolean;
  onToggle: () => void;
}) {
  const label = active ? "Ocultar verbos" : "Resaltar verbos";

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={isLoading}
      onClick={onToggle}
      className="text-muted-foreground opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 aria-pressed:opacity-100"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <SpellCheck2 />}
    </Button>
  );
}
