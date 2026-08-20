import type { PortfolioAllocation, RiskProfile, ScoredCredit } from "../scoring/types";

export const MIN_SCORE_BY_RISK: Record<RiskProfile, number> = {
  Conservative: 75,
  Balanced: 50,
  Aggressive: 0,
};

export const MAX_SHARE_PER_PROJECT: Record<RiskProfile, number> = {
  Conservative: 0.5,
  Balanced: 0.6,
  Aggressive: 1,
};

function sortForRisk(credits: ScoredCredit[], risk: RiskProfile): ScoredCredit[] {
  const pricePerTon = (c: ScoredCredit) => Number(c.priceWei);

  if (risk === "Conservative") {
    return [...credits].sort(
      (a, b) => b.finalScore - a.finalScore || pricePerTon(a) - pricePerTon(b),
    );
  }
  if (risk === "Aggressive") {
    return [...credits].sort((a, b) => pricePerTon(a) - pricePerTon(b));
  }
  return [...credits].sort(
    (a, b) => b.finalScore / pricePerTon(b) - a.finalScore / pricePerTon(a),
  );
}

export interface PortfolioSelection {
  allocations: PortfolioAllocation[];
  totalCostWei: bigint;
  totalTons: number;
  shortfall: number;
}

export function selectPortfolio(
  scoredCredits: ScoredCredit[],
  targetTons: number,
  riskProfile: RiskProfile,
): PortfolioSelection {
  const minScore = MIN_SCORE_BY_RISK[riskProfile];
  const maxShare = MAX_SHARE_PER_PROJECT[riskProfile];
  const maxTonsPerProject = Math.max(1, Math.floor(targetTons * maxShare));

  const eligible = sortForRisk(
    scoredCredits.filter((c) => c.finalScore >= minScore),
    riskProfile,
  );

  const allocations: PortfolioAllocation[] = [];
  let remainingTons = targetTons;
  let totalCostWei = 0n;

  for (const credit of eligible) {
    if (remainingTons <= 0) break;

    const availableTons = Number(credit.availableSupply);
    const wantTons = Math.min(remainingTons, maxTonsPerProject, availableTons);
    if (wantTons <= 0) continue;

    const costWei = credit.priceWei * BigInt(wantTons);
    allocations.push({ tokenId: credit.tokenId, amount: wantTons, costWei });
    totalCostWei += costWei;
    remainingTons -= wantTons;
  }

  const achievedTons = targetTons - remainingTons;
  return {
    allocations,
    totalCostWei,
    totalTons: achievedTons,
    shortfall: Math.max(0, remainingTons),
  };
}
