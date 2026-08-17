import type { CreditRecord } from "./types";

const CERTIFICATION_CREDIBILITY: Record<string, number> = {
  "Verra VCS": 85,
  "Gold Standard": 90,
  "Puro.earth": 88,
  "American Carbon Registry": 82,
};
const DEFAULT_CERTIFICATION_CREDIBILITY = 60;

const PROJECT_TYPE_BASELINE: Record<string, number> = {
  "Renewable Energy": 80,
  Reforestation: 75,
  Conservation: 70,
};
const DEFAULT_PROJECT_TYPE_BASELINE = 65;

export function ruleBasedScore(credit: CreditRecord, currentYear: number): number {
  const certificationScore =
    CERTIFICATION_CREDIBILITY[credit.certificationStandard] ?? DEFAULT_CERTIFICATION_CREDIBILITY;

  const yearsSinceVintage = Math.max(0, currentYear - credit.vintageYear);
  const vintageScore = Math.max(0, 100 - yearsSinceVintage * 5);

  const projectTypeScore =
    PROJECT_TYPE_BASELINE[credit.projectType] ?? DEFAULT_PROJECT_TYPE_BASELINE;

  const weighted =
    certificationScore * 0.4 + vintageScore * 0.3 + projectTypeScore * 0.3;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}
