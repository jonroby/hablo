"use client";

import { Loader2, Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";

/** An icon button that toggles all highlight rules for a message. */
export function HighlightToggle({
  active,
  isLoading,
  onToggle,
}: {
  active: boolean;
  isLoading: boolean;
  onToggle: () => void;
}) {
  const label = active ? "Ocultar resaltado" : "Resaltar";

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
      {isLoading ? <Loader2 className="animate-spin" /> : <Highlighter />}
    </Button>
  );
}
