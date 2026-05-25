import { SpeakerButton } from "@/components/chat/speaker-button";
import { TranslationToggle } from "@/components/chat/translation-toggle";
import { VerbToggle } from "@/components/chat/verb-toggle";

interface MessageControlsProps {
  /** The Spanish text the speaker reads aloud. */
  text: string;
  /** Alternate-language text revealed by the translation toggle, if any. */
  translation?: string;
  /** Whether verb highlighting is currently active for this message. */
  verbsActive: boolean;
  /** Whether the verbs request is in flight. */
  verbsLoading: boolean;
  /** Toggles verb highlighting on or off. */
  onToggleVerbs: () => void;
}

/** The row of per-message actions (listen, highlight verbs, translate). */
export function MessageControls({
  text,
  translation,
  verbsActive,
  verbsLoading,
  onToggleVerbs,
}: MessageControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <SpeakerButton text={text} />
      <VerbToggle
        active={verbsActive}
        isLoading={verbsLoading}
        onToggle={onToggleVerbs}
      />
      {translation ? <TranslationToggle text={translation} /> : null}
    </div>
  );
}
