import { describe, it, expect } from "vitest";
import { ruleBasedScore } from "./ruleBasedScore";
import type { CreditRecord } from "./types";

function makeCredit(overrides: Partial<CreditRecord> = {}): CreditRecord {
  return {
    tokenId: 0,
    projectType: "Reforestation",
    certificationStandard: "Verra VCS",
    vintageYear: 2023,
    location: "Kalimantan",
    qualityScoreOnChain: 80,
    priceWei: 1000n,
    availableSupply: 100n,
    ...overrides,
  };
}

describe("ruleBasedScore", () => {
  it("scores a recent, well-certified project highly", () => {
    const score = ruleBasedScore(makeCredit({ vintageYear: 2026 }), 2026);
    expect(score).toBeGreaterThanOrEqual(75);
  });

  it("penalizes older vintages", () => {
    const recent = ruleBasedScore(makeCredit({ vintageYear: 2026 }), 2026);
    const old = ruleBasedScore(makeCredit({ vintageYear: 2010 }), 2026);
    expect(old).toBeLessThan(recent);
  });

  it("falls back to a default for unknown certification standards", () => {
    const known = ruleBasedScore(makeCredit({ certificationStandard: "Gold Standard" }), 2026);
    const unknown = ruleBasedScore(
      makeCredit({ certificationStandard: "Some Unrecognized Standard" }),
      2026,
    );
    expect(unknown).toBeLessThan(known);
  });

  it("clamps score to 0-100", () => {
    const score = ruleBasedScore(makeCredit({ vintageYear: 1980 }), 2026);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
