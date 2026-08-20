import { scoreBand, bandTextClass, bandRawColor } from "@/lib/scoreBand";

export function ScoreBar({ score }: { score: number }) {
  const band = scoreBand(score);
  return (
    <div
      className="flex items-center gap-2"
      title="Quality score: 40% rule-based fundamentals + 60% AI-reasoned analysis, out of 100"
    >
      <div className="w-16 h-1.5 rounded-full bg-line overflow-hidden shrink-0">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, background: bandRawColor(band) }}
        />
      </div>
      <span className={`font-data text-xs ${bandTextClass(band)}`}>
        {score}
        <span className="text-ink-soft">/100</span>
      </span>
    </div>
  );
}
