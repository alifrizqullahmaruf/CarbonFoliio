import { describe, it, expect } from "vitest";
import { combineScore, confidenceFromScore } from "./combineScore";
import type { CreditRecord } from "./types";

const credit: CreditRecord = {
  tokenId: 0,
  projectType: "Reforestation",
  certificationStandard: "Verra VCS",
  vintageYear: 2023,
  location: "Kalimantan",
  qualityScoreOnChain: 80,
  priceWei: 1000n,
  availableSupply: 100n,
};

describe("combineScore", () => {
  it("weights the LLM score more heavily than the rule score", () => {
    const result = combineScore(credit, 100, 0, "rationale");
    expect(result.finalScore).toBe(40);
  });

  it("carries through the credit fields and rationale", () => {
    const result = combineScore(credit, 70, 80, "looks solid");
    expect(result.tokenId).toBe(0);
    expect(result.llmRationale).toBe("looks solid");
  });
});

describe("confidenceFromScore", () => {
  it("classifies scores into Low/Medium/High bands", () => {
    expect(confidenceFromScore(80)).toBe("High");
    expect(confidenceFromScore(60)).toBe("Medium");
    expect(confidenceFromScore(30)).toBe("Low");
  });
});
