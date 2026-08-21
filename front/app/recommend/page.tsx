"use client";

import { useState, type FormEvent } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";
import { portfolioManagerAbi } from "@/lib/chain/portfolioManagerAbi";
import type { RiskProfile } from "@/lib/scoring/types";
import type { RecommendResponseDTO } from "@/lib/scoring/clientTypes";
import { formatOkb } from "@/lib/format";
import { MIN_SCORE_BY_RISK, MAX_SHARE_PER_PROJECT } from "@/lib/recommendation/buildPortfolio";
import { PageHeading } from "@/components/PageHeading";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { StatusMessage } from "@/components/StatusMessage";
import { ScoreBar } from "@/components/ScoreBar";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

const PORTFOLIO_MANAGER_ADDRESS = process.env
  .NEXT_PUBLIC_PORTFOLIO_MANAGER_ADDRESS as Address;

const RISK_PROFILES: RiskProfile[] = ["Conservative", "Balanced", "Aggressive"];

function RiskSelector({
  value,
  onChange,
}: {
  value: RiskProfile;
  onChange: (r: RiskProfile) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {RISK_PROFILES.map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              active ? "border-leaf bg-leaf-pale" : "border-line hover:border-leaf"
            }`}
          >
            <div>
              <p
                className={`font-data text-xs uppercase tracking-widest ${active ? "text-leaf-dark" : "text-ink"}`}
              >
                {r}
              </p>
              <p className="font-body text-xs text-ink-soft mt-0.5">
                Min AI Score {MIN_SCORE_BY_RISK[r]} · up to{" "}
                {Math.round(MAX_SHARE_PER_PROJECT[r] * 100)}% per project
              </p>
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-leaf" : "border-line"}`}
            >
              {active && <span className="w-2 h-2 rounded-full bg-leaf" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}


export default function RecommendPage() {
  const { isConnected } = useAccount();
  const [targetTons, setTargetTons] = useState("10");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [result, setResult] = useState<RecommendResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTons: Number(targetTons), riskProfile }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `Request failed: ${res.status}`);
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleApprove() {
    if (!result) return;
    writeContract({
      address: PORTFOLIO_MANAGER_ADDRESS,
      abi: portfolioManagerAbi,
      functionName: "allocate",
      args: [
        result.allocations.map((a) => BigInt(a.tokenId)),
        result.allocations.map((a) => BigInt(a.amount)),
      ],
      value: BigInt(result.totalCostWei),
    });
  }

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-6xl mx-auto w-full">
      <PageHeading
        eyebrow="Instrument reading"
        title="Get a Recommendation"
        description="Set a target and a risk preference. The engine scores every available credit, then assembles the combination that fits — with the reasoning shown, not hidden."
      />

      <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:sticky lg:top-24">
          <Card className="flex flex-col gap-6">
            <div>
              <p className="font-data text-xs uppercase tracking-widest text-ink-soft mb-2">
                Risk profile
              </p>
              <RiskSelector value={riskProfile} onChange={setRiskProfile} />
            </div>

            <label className="flex flex-col gap-2 font-data text-xs uppercase tracking-widest text-ink-soft">
              Target offset (tons CO2)
              <input
                type="number"
                min={1}
                required
                placeholder="e.g. 50"
                value={targetTons}
                onChange={(e) => setTargetTons(e.target.value)}
                className="w-full border border-line bg-leaf-pale rounded-lg px-4 py-3 font-data text-2xl text-ink normal-case tracking-normal placeholder:text-ink-soft/40 focus:outline-none focus:border-leaf"
              />
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Reading the chain…" : "Get Recommendation"}
            </Button>

            {error && <StatusMessage variant="error">Error: {error}</StatusMessage>}
          </Card>
        </form>

        <div>
          {loading && (
            <Card className="flex items-center justify-center py-20">
              <StatusMessage variant="loading">Reading the chain…</StatusMessage>
            </Card>
          )}

          {!loading && !result && (
            <Card className="flex flex-col items-center justify-center text-center gap-2 py-20 border-dashed">
              <p className="font-data text-xs uppercase tracking-widest text-ink-soft">
                Awaiting input
              </p>
              <p className="font-body text-sm text-ink-soft max-w-xs">
                Set a target and press Get Recommendation to see the readout.
              </p>
            </Card>
          )}

          {!loading && result && (
            <div className="flex flex-col gap-6">
              {result.shortfall > 0 && (
                <StatusMessage variant="note">
                  Only {result.totalTons} of {Number(targetTons)} tons could be matched at this
                  risk level.
                </StatusMessage>
              )}

              <Card className="flex flex-col gap-1">
                <span className="font-data text-xs uppercase tracking-widest text-ink-soft">
                  Total cost
                </span>
                <span className="font-display text-4xl md:text-5xl text-ink">
                  {formatOkb(result.totalCostWei)}{" "}
                  <span className="font-data text-lg text-ink-soft">OKB</span>
                </span>
              </Card>

              {result.allocations.length > 0 && (
                <Card padding="sm" className="flex flex-col divide-y divide-line">
                  {result.allocations.map((a) => (
                    <div key={a.tokenId} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base text-ink">{a.projectType}</p>
                          <ConfidenceBadge confidence={a.confidence} />
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <ScoreBar score={a.finalScore ?? 0} />
                          <span className="font-data text-sm text-ink w-12 text-right">
                            {a.amount} t
                          </span>
                        </div>
                      </div>
                      <p className="font-body text-xs text-ink-soft">{a.certificationStandard}</p>
                      {a.ruleScore !== undefined && a.llmScore !== undefined && (
                        <p className="font-data text-[11px] text-ink-soft">
                          Rule {a.ruleScore} · AI {a.llmScore}
                        </p>
                      )}
                      {a.llmRationale && (
                        <p className="font-body text-xs text-ink-soft leading-relaxed border-l-2 border-line pl-3">
                          {a.llmRationale}
                        </p>
                      )}
                    </div>
                  ))}
                </Card>
              )}

              {result.allocations.length > 0 && (
                <p className="font-data text-[11px] text-ink-soft -mt-2">
                  AI Score = 40% rule-based fundamentals + 60% AI-reasoned analysis, out of 100.
                </p>
              )}

              <Card className="bg-leaf-pale flex flex-col gap-2">
                <span className="font-data text-xs uppercase tracking-widest text-leaf-dark">
                  Why this mix
                </span>
                <p className="font-body text-ink-soft leading-relaxed">{result.explanation}</p>
              </Card>

              {isConnected ? (
                <Button
                  onClick={handleApprove}
                  disabled={isPending || isConfirming}
                  className="self-start"
                >
                  {isPending || isConfirming ? "Processing…" : "Approve & Execute"}
                </Button>
              ) : (
                <StatusMessage variant="loading">
                  Connect your wallet to execute this allocation.
                </StatusMessage>
              )}

              {writeError && (
                <StatusMessage variant="error">
                  Transaction error: {writeError.message}
                </StatusMessage>
              )}
              {isConfirmed && (
                <p className="text-leaf-dark font-data text-sm">
                  Allocation confirmed — check your portfolio.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
