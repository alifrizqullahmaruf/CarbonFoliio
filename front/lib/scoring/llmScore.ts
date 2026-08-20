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

/**
 * Pulls a JSON object out of raw LLM text — some responses come back wrapped
 * in a markdown code fence or preceded by a heading despite the requested
 * response_format, so a plain JSON.parse on the raw content is not reliable.
 */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in LLM response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

/**
 * OpenRouter does not always enforce the requested response_format for this
 * model, so the model sometimes invents its own key names (e.g. "projects"
 * instead of "scores", "qualityScore" instead of "score"). Normalize the
 * common variants before validating against the real schema.
 */
function normalizeScorePayload(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const obj = raw as Record<string, unknown>;
  const list = obj.scores ?? obj.projects ?? obj.results ?? obj.assessments;
  if (!Array.isArray(list)) return raw;

  return {
    scores: list.map((entry) => {
      const e = entry as Record<string, unknown>;
      return {
        tokenId: e.tokenId,
        score: e.score ?? e.qualityScore ?? e.finalScore,
        rationale: e.rationale ?? e.reason ?? e.explanation,
      };
    }),
  };
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

  const completion = await client.chat.completions.create({
    model: OPENROUTER_MODEL,
    max_tokens: 4096,
    response_format: zodResponseFormat(CreditScoreSchema, "credit_scores"),
    messages: [
      {
        role: "user",
        content: `You are assessing the credibility of tokenized carbon credit projects for an investment platform. For each project below, assign a quality score from 0-100 based on the certification standard's rigor, the plausibility of the project type actually delivering claimed carbon reduction, and any other credibility signals in the metadata. Write a one-sentence rationale per project explaining the score.

Respond with a single JSON object only — no markdown, no headings, no code fences, no commentary before or after it. Use exactly this shape, with these exact key names, one entry per project, in this order:

{"scores":[{"tokenId":0,"score":72,"rationale":"..."}]}

Projects:
${JSON.stringify(creditSummaries, null, 2)}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("LLM did not return a text response");
  }
  const parsed = CreditScoreSchema.parse(normalizeScorePayload(extractJson(content)));
  return parsed.scores;
}
