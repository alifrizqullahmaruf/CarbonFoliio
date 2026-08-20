import { NextResponse } from "next/server";
import { scoreAllCredits } from "@/lib/scoring/scoreAllCredits";
import { selectPortfolio, MIN_SCORE_BY_RISK } from "@/lib/recommendation/buildPortfolio";
import { generateExplanation } from "@/lib/recommendation/generateExplanation";
import { getChainConfig } from "@/lib/config";
import type { RiskProfile } from "@/lib/scoring/types";

interface RecommendRequestBody {
  targetTons: number;
  riskProfile: RiskProfile;
}

const VALID_RISK_PROFILES: RiskProfile[] = ["Conservative", "Balanced", "Aggressive"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendRequestBody;

    if (!body.targetTons || body.targetTons <= 0) {
      return NextResponse.json(
        { error: "targetTons must be a positive number" },
        { status: 400 },
      );
    }
    if (!VALID_RISK_PROFILES.includes(body.riskProfile)) {
      return NextResponse.json(
        { error: "riskProfile must be Conservative, Balanced, or Aggressive" },
        { status: 400 },
      );
    }

    const { rpcUrl, contractAddress } = getChainConfig();
    const scoredCredits = await scoreAllCredits(rpcUrl, contractAddress);
    const portfolio = selectPortfolio(scoredCredits, body.targetTons, body.riskProfile);

    const explanation =
      portfolio.allocations.length === 0
        ? `No credits meet the minimum AI Score of ${MIN_SCORE_BY_RISK[body.riskProfile]} required for a ${body.riskProfile} risk profile right now. Try a less conservative risk profile, or check back once more credits are listed.`
        : await generateExplanation(
            portfolio.allocations,
            scoredCredits,
            body.targetTons,
            body.riskProfile,
          );

    const creditsByTokenId = new Map(scoredCredits.map((c) => [c.tokenId, c]));

    return NextResponse.json({
      allocations: portfolio.allocations.map((a) => {
        const credit = creditsByTokenId.get(a.tokenId);
        return {
          ...a,
          costWei: a.costWei.toString(),
          projectType: credit?.projectType,
          certificationStandard: credit?.certificationStandard,
          ruleScore: credit?.ruleScore,
          llmScore: credit?.llmScore,
          llmRationale: credit?.llmRationale,
          finalScore: credit?.finalScore,
          confidence: credit?.confidence,
        };
      }),
      totalCostWei: portfolio.totalCostWei.toString(),
      totalTons: portfolio.totalTons,
      shortfall: portfolio.shortfall,
      explanation,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
