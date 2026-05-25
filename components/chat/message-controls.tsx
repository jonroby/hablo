import { SpeakerButton } from "@/components/chat/speaker-button";
import { TranslationToggle } from "@/components/chat/translation-toggle";

interface MessageControlsProps {
  /** The Spanish text the speaker reads aloud. */
  text: string;
  /** Alternate-language text revealed by the translation toggle, if any. */
  translation?: string;
}

/** The row of per-message actions (listen, translate). */
export function MessageControls({ text, translation }: MessageControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <SpeakerButton text={text} />
      {translation ? <TranslationToggle text={translation} /> : null}
    </div>
  );
}
