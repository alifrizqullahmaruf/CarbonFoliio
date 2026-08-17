import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { CreditRecord } from "./types";

const CreditScoreSchema = z.object({
  scores: z.array(
    z.object({
      tokenId: z.number().int(),
      score: z.number().int().min(0).max(100),
      rationale: z.string(),
    }),
  ),
});

export type LlmCreditScore = z.infer<typeof CreditScoreSchema>["scores"][number];

const OPENROUTER_MODEL = "anthropic/claude-opus-5";

function getOpenRouterClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function scoreCreditsWithLlm(
  credits: CreditRecord[],
): Promise<LlmCreditScore[]> {
  const client = getOpenRouterClient();

  const creditSummaries = credits.map((c) => ({
    tokenId: c.tokenId,
    projectType: c.projectType,
    certificationStandard: c.certificationStandard,
    vintageYear: c.vintageYear,
    location: c.location,
  }));

  const completion = await client.chat.completions.parse({
    model: OPENROUTER_MODEL,
    max_tokens: 4096,
    response_format: zodResponseFormat(CreditScoreSchema, "credit_scores"),
    messages: [
      {
        role: "user",
        content: `You are assessing the credibility of tokenized carbon credit projects for an investment platform. For each project below, assign a quality score from 0-100 based on the certification standard's rigor, the plausibility of the project type actually delivering claimed carbon reduction, and any other credibility signals in the metadata. Write a one-sentence rationale per project explaining the score.

Projects:
${JSON.stringify(creditSummaries, null, 2)}`,
      },
    ],
  });

  const parsed = completion.choices[0]?.message?.parsed;
  if (!parsed) {
    throw new Error("LLM did not return parseable structured output");
  }
  return parsed.scores;
}
