import type { CreditRecord, ScoredCredit } from "./types";

export function confidenceFromScore(score: number): "Low" | "Medium" | "High" {
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

export function combineScore(
  credit: CreditRecord,
  ruleScore: number,
  llmScore: number,
  llmRationale: string,
): ScoredCredit {
  const finalScore = Math.round(ruleScore * 0.4 + llmScore * 0.6);
  return {
    ...credit,
    ruleScore,
    llmScore,
    llmRationale,
    finalScore,
    confidence: confidenceFromScore(finalScore),
  };
}
