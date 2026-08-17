import { describe, it, expect } from "vitest";
import { selectPortfolio } from "./buildPortfolio";
import type { ScoredCredit } from "../scoring/types";

function makeScoredCredit(overrides: Partial<ScoredCredit> = {}): ScoredCredit {
  return {
    tokenId: 0,
    projectType: "Reforestation",
    certificationStandard: "Verra VCS",
    vintageYear: 2023,
    location: "Kalimantan",
    qualityScoreOnChain: 80,
    priceWei: 1000n,
    availableSupply: 1000n,
    ruleScore: 80,
    llmScore: 80,
    finalScore: 80,
    llmRationale: "solid",
    confidence: "High",
    ...overrides,
  };
}

describe("selectPortfolio", () => {
  it("excludes credits below the risk profile's minimum score", () => {
    const credits = [
      makeScoredCredit({ tokenId: 0, finalScore: 40 }),
      makeScoredCredit({ tokenId: 1, finalScore: 90 }),
    ];
    const result = selectPortfolio(credits, 10, "Conservative");
    expect(result.allocations.map((a) => a.tokenId)).toEqual([1]);
  });

  it("diversifies across projects for Balanced risk instead of using only the cheapest", () => {
    const credits = [
      makeScoredCredit({ tokenId: 0, finalScore: 80, priceWei: 100n, availableSupply: 1000n }),
      makeScoredCredit({ tokenId: 1, finalScore: 80, priceWei: 200n, availableSupply: 1000n }),
    ];
    const result = selectPortfolio(credits, 100, "Balanced");
    expect(result.allocations.length).toBeGreaterThan(1);
    expect(result.totalTons).toBe(100);
  });

  it("reports a shortfall when eligible supply cannot cover the target", () => {
    const credits = [makeScoredCredit({ tokenId: 0, finalScore: 90, availableSupply: 5n })];
    const result = selectPortfolio(credits, 20, "Aggressive");
    expect(result.totalTons).toBe(5);
    expect(result.shortfall).toBe(15);
  });

  it("computes totalCostWei as the sum of each allocation's cost", () => {
    const credits = [makeScoredCredit({ tokenId: 0, finalScore: 90, priceWei: 3n, availableSupply: 1000n })];
    const result = selectPortfolio(credits, 10, "Aggressive");
    expect(result.totalCostWei).toBe(30n);
  });
});
