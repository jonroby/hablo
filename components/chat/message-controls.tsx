import { HighlightToggle } from "@/components/chat/highlight-toggle";
import { SpeakerButton } from "@/components/chat/speaker-button";
import { TranslationToggle } from "@/components/chat/translation-toggle";

interface MessageControlsProps {
  /** The Spanish text the speaker reads aloud. */
  text: string;
  /** Alternate-language text revealed by the translation toggle, if any. */
  translation?: string;
  /** Whether highlighting is currently active for this message. */
  highlightActive: boolean;
  /** Whether the highlight rules are still running. */
  highlightLoading: boolean;
  /** Toggles highlighting on or off. */
  onToggleHighlight: () => void;
}

/** The row of per-message actions (listen, highlight, translate). */
export function MessageControls({
  text,
  translation,
  highlightActive,
  highlightLoading,
  onToggleHighlight,
}: MessageControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <SpeakerButton text={text} />
      <HighlightToggle
        active={highlightActive}
        isLoading={highlightLoading}
        onToggle={onToggleHighlight}
      />
      {translation ? <TranslationToggle text={translation} /> : null}
    </div>
  );
}
