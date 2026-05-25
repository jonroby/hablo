"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** An icon button that reveals a translation in a popover above it. */
export function TranslationToggle({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Ver traducción"
          title="Ver traducción"
          className="text-muted-foreground opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
        >
          <Languages />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="leading-relaxed whitespace-pre-wrap"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}
