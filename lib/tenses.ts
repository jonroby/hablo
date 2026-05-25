import type { TenseName } from "@/lib/prompts";

export type TenseGroup = "simple" | "compound" | "mood";

export interface TenseInfo {
  /** Whether the tense is simple, compound, or a mood (imperative). */
  group: TenseGroup;
  /** A short, learner-friendly explanation of when the tense is used. */
  explainer: string;
  /** A few stock example sentences that use the tense. */
  examples: string[];
}

/** Display labels for each tense group. */
export const GROUP_LABEL: Record<TenseGroup, string> = {
  simple: "Tiempo simple",
  compound: "Tiempo compuesto",
  mood: "Modo",
};

/**
 * Reference notes for each Barron's tense (the 14 tenses + the imperative).
 * Static so the explainer panel is instant, free, and consistent. Keyed by the
 * exact tense names the verbs API returns (see VERB_TENSES).
 */
export const TENSE_INFO: Record<TenseName, TenseInfo> = {
  // ── 7 simple ──────────────────────────────────────────────────────────
  Presente: {
    group: "simple",
    explainer:
      "Describe acciones habituales o que ocurren ahora, y verdades generales.",
    examples: ["Hablo español.", "Ella vive en Madrid.", "El agua hierve a 100°."],
  },
  Imperfecto: {
    group: "simple",
    explainer:
      "Describe acciones pasadas en curso, habituales o de fondo, sin un final marcado.",
    examples: ["Cuando era niño, jugaba mucho.", "Llovía toda la tarde."],
  },
  Pretérito: {
    group: "simple",
    explainer:
      "Acciones completas y puntuales en el pasado, con un inicio y un final claros.",
    examples: ["Comí paella.", "Ayer fui al cine.", "Nací en 1990."],
  },
  Futuro: {
    group: "simple",
    explainer:
      "Acciones que ocurrirán más adelante; también para hacer conjeturas sobre el presente.",
    examples: ["Mañana viajaré a Lima.", "¿Quién será a esta hora?"],
  },
  Condicional: {
    group: "simple",
    explainer:
      "Acciones hipotéticas o dependientes de una condición, y peticiones corteses.",
    examples: ["Yo iría contigo.", "¿Podrías ayudarme?"],
  },
  "Presente de subjuntivo": {
    group: "simple",
    explainer:
      "Expresa deseos, dudas, emociones o lo no real, tras expresiones como «espero que».",
    examples: ["Espero que vengas.", "Ojalá llueva pronto."],
  },
  "Imperfecto de subjuntivo": {
    group: "simple",
    explainer:
      "El subjuntivo en el pasado o en condiciones hipotéticas, tras «si» o verbos en pasado.",
    examples: ["Si tuviera dinero, viajaría.", "Quería que vinieras."],
  },
  // ── 7 compound ────────────────────────────────────────────────────────
  "Pretérito perfecto": {
    group: "compound",
    explainer:
      "Acciones pasadas con relación con el presente. Se forma con «haber» + participio.",
    examples: ["He visto esa película.", "Hoy hemos trabajado mucho."],
  },
  Pluscuamperfecto: {
    group: "compound",
    explainer:
      "Una acción pasada anterior a otra acción pasada. Se forma con «había» + participio.",
    examples: ["Ya había comido cuando llegaste.", "Nunca había viajado tan lejos."],
  },
  "Pretérito anterior": {
    group: "compound",
    explainer:
      "Acción inmediatamente anterior a otra en el pasado. Literario y poco usado hoy.",
    examples: ["Apenas hubo terminado, salió.", "Cuando hubo llegado, cenamos."],
  },
  "Futuro perfecto": {
    group: "compound",
    explainer:
      "Una acción que estará terminada en el futuro. Se forma con «habré» + participio.",
    examples: ["Para mayo habré terminado.", "Mañana ya habrán llegado."],
  },
  "Condicional perfecto": {
    group: "compound",
    explainer:
      "Lo que habría ocurrido bajo una condición. Se forma con «habría» + participio.",
    examples: ["Yo habría ido, pero llovía.", "Lo habríamos sabido antes."],
  },
  "Perfecto de subjuntivo": {
    group: "compound",
    explainer:
      "Subjuntivo para acciones pasadas o ya completas. Se forma con «haya» + participio.",
    examples: ["Espero que hayas comido.", "Me alegra que hayan venido."],
  },
  "Pluscuamperfecto de subjuntivo": {
    group: "compound",
    explainer:
      "Subjuntivo para lo anterior a otro punto del pasado. Usa «hubiera» + participio.",
    examples: ["Si hubiera sabido, habría venido.", "Ojalá lo hubieras visto."],
  },
  // ── mood ──────────────────────────────────────────────────────────────
  Imperativo: {
    group: "mood",
    explainer: "Da órdenes, instrucciones o consejos directos.",
    examples: ["¡Habla más despacio!", "Cierra la puerta.", "Vámonos."],
  },
};
