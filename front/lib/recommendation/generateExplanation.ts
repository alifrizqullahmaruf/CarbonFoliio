import OpenAI from "openai";
import type { PortfolioAllocation, RiskProfile, ScoredCredit } from "../scoring/types";

const OPENROUTER_MODEL = "anthropic/claude-opus-5";

function getOpenRouterClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function generateExplanation(
  allocations: PortfolioAllocation[],
  scoredCredits: ScoredCredit[],
  targetTons: number,
  riskProfile: RiskProfile,
): Promise<string> {
  const client = getOpenRouterClient();
  const creditsByTokenId = new Map(scoredCredits.map((c) => [c.tokenId, c]));

  const allocationSummaries = allocations.map((a) => {
    const credit = creditsByTokenId.get(a.tokenId);
    return {
      tokenId: a.tokenId,
      tons: a.amount,
      projectType: credit?.projectType,
      certificationStandard: credit?.certificationStandard,
      finalScore: credit?.finalScore,
      confidence: credit?.confidence,
    };
  });

  const completion = await client.chat.completions.create({
    model: OPENROUTER_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `A user wants to offset ${targetTons} tons of CO2 with a "${riskProfile}" risk preference. The following portfolio was selected algorithmically (higher-scored, better-value credits preferred, diversified across projects per the risk profile):

${JSON.stringify(allocationSummaries, null, 2)}

Write a short (3-5 sentence) plain-language explanation for the user of why this combination of credits was chosen, referencing the quality scores and diversification. Do not use markdown headers or bullet points — plain prose only.`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("LLM did not return a text explanation");
  }
  return text;
}
