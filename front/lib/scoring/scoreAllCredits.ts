import { createCarbonCreditReader } from "../chain/carbonCreditClient";
import { ruleBasedScore } from "./ruleBasedScore";
import { scoreCreditsWithLlm } from "./llmScore";
import { combineScore } from "./combineScore";
import type { Address } from "viem";
import type { ScoredCredit } from "./types";

export async function scoreAllCredits(
  rpcUrl: string,
  contractAddress: Address,
): Promise<ScoredCredit[]> {
  const reader = createCarbonCreditReader(rpcUrl, contractAddress);
  const credits = await reader.listAvailableCredits();

  if (credits.length === 0) return [];

  const currentYear = new Date().getFullYear();
  const llmScores = await scoreCreditsWithLlm(credits);
  const llmScoreByTokenId = new Map(llmScores.map((s) => [s.tokenId, s]));

  return credits.map((credit) => {
    const ruleScore = ruleBasedScore(credit, currentYear);
    const llmResult = llmScoreByTokenId.get(credit.tokenId);
    if (!llmResult) {
      throw new Error(`LLM did not return a score for tokenId ${credit.tokenId}`);
    }
    return combineScore(credit, ruleScore, llmResult.score, llmResult.rationale);
  });
}
