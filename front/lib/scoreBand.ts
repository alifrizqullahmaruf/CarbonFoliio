export type ScoreBand = "high" | "medium" | "low";
export type Confidence = "Low" | "Medium" | "High";

/** Single source of truth for score-band coloring — a traffic-light read on trust: green (verified), gold (caution), muted (uncertain). */
const BAND_COLOR = {
  high: { text: "text-leaf-dark", raw: "var(--leaf)" },
  medium: { text: "text-gold", raw: "var(--gold)" },
  low: { text: "text-ink-soft", raw: "var(--ink-soft)" },
} as const;

/** Matches the server's confidenceFromScore thresholds (lib/scoring/combineScore.ts). */
export function scoreBand(score: number): ScoreBand {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function confidenceToBand(confidence: Confidence): ScoreBand {
  return confidence.toLowerCase() as ScoreBand;
}

/** Tailwind text color class for the band. */
export function bandTextClass(band: ScoreBand): string {
  return BAND_COLOR[band].text;
}

/** CSS custom-property value for the band, for inline styles (e.g. bar fills). */
export function bandRawColor(band: ScoreBand): string {
  return BAND_COLOR[band].raw;
}
