import { bandTextClass, bandRawColor, confidenceToBand, type Confidence } from "@/lib/scoreBand";

export function ConfidenceBadge({ confidence }: { confidence?: string }) {
  if (!confidence) return null;
  const band = confidenceToBand(confidence as Confidence);
  return (
    <span
      className={`font-data text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border whitespace-nowrap ${bandTextClass(band)}`}
      style={{ borderColor: bandRawColor(band) }}
    >
      {confidence}
    </span>
  );
}
