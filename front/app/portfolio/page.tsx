"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAccount, useReadContract } from "wagmi";
import type { Address } from "viem";
import { portfolioManagerAbi } from "@/lib/chain/portfolioManagerAbi";
import { useScoredCredits } from "@/hooks/useScoredCredits";
import { formatOkb } from "@/lib/format";
import { PageHeading } from "@/components/PageHeading";
import { Card } from "@/components/Card";
import { LinkButton } from "@/components/Button";
import { StatusMessage } from "@/components/StatusMessage";
import { ScoreBar } from "@/components/ScoreBar";

const PORTFOLIO_MANAGER_ADDRESS = process.env
  .NEXT_PUBLIC_PORTFOLIO_MANAGER_ADDRESS as Address;

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { credits: catalog, error: catalogError } = useScoredCredits();
  const [expandedTokenIds, setExpandedTokenIds] = useState<Set<number>>(new Set());
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  function toggleExpanded(tokenId: number) {
    setExpandedTokenIds((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  }

  const { data, isLoading, error } = useReadContract({
    address: PORTFOLIO_MANAGER_ADDRESS,
    abi: portfolioManagerAbi,
    functionName: "getPortfolio",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const heading = (
    <PageHeading
      eyebrow="Ledger"
      title="My Portfolio"
      description="Every credit your wallet holds, read live from PortfolioManager on X Layer."
    />
  );

  if (!isConnected) {
    return (
      <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
        {heading}
        <Card className="flex flex-col items-center justify-center text-center gap-2 py-20 border-dashed">
          <p className="font-data text-xs uppercase tracking-widest text-ink-soft">
            Wallet not connected
          </p>
          <p className="font-body text-sm text-ink-soft max-w-xs">
            Connect your wallet to view your holdings.
          </p>
        </Card>
      </div>
    );
  }

  // The catalog (AI scoring) is an enrichment on top of the on-chain holdings,
  // not the holdings themselves — a catalog failure should never hide what
  // the wallet actually owns, so "loading" only waits for it to settle
  // (success or error), and only a real on-chain read failure blocks the page.
  const catalogSettled = catalog !== null || catalogError !== null;
  const chainLoading = isLoading || (data ? data[0].length > 0 && !catalogSettled : false);

  if (chainLoading) {
    return (
      <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
        {heading}
        <Card className="flex items-center justify-center py-20">
          <StatusMessage variant="loading">Reading the chain…</StatusMessage>
        </Card>
      </div>
    );
  }
  if (error) {
    return (
      <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
        {heading}
        <StatusMessage variant="error">Error: {error.message}</StatusMessage>
      </div>
    );
  }

  const [tokenIds, balances] = data ?? [[], []];
  const catalogByTokenId = new Map((catalog ?? []).map((c) => [c.tokenId, c]));

  const totalTons = balances.reduce((sum, b) => sum + b, 0n);
  const totalValueWei = tokenIds.reduce((sum, tokenId, i) => {
    const credit = catalogByTokenId.get(Number(tokenId));
    return credit ? sum + BigInt(credit.priceWei) * balances[i] : sum;
  }, 0n);
  const heldCredits = tokenIds.map((id) => catalogByTokenId.get(Number(id))).filter(Boolean);
  const distinctProjects = new Set(heldCredits.map((c) => c!.projectType)).size;
  const distinctRegistries = new Set(heldCredits.map((c) => c!.certificationStandard)).size;

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
      {heading}

      {tokenIds.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center gap-3 py-20 border-dashed">
          <p className="font-data text-xs uppercase tracking-widest text-ink-soft">
            No holdings yet
          </p>
          <p className="font-body text-sm text-ink-soft max-w-xs">
            You haven&apos;t allocated any credits yet.
          </p>
          <LinkButton href="/recommend" size="sm">
            Build a portfolio
          </LinkButton>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {catalogError && (
            <StatusMessage variant="note">
              AI scoring is temporarily unavailable — showing raw holdings only.
            </StatusMessage>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="flex flex-col gap-1">
              <span className="font-data text-xs uppercase tracking-widest text-ink-soft">
                Tons held
              </span>
              <span className="font-display text-3xl text-ink">{totalTons.toString()}</span>
            </Card>
            <Card className="flex flex-col gap-1">
              <span className="font-data text-xs uppercase tracking-widest text-ink-soft">
                Est. value
              </span>
              <span className="font-display text-3xl text-ink">
                {formatOkb(totalValueWei.toString())}{" "}
                <span className="font-data text-sm text-ink-soft">OKB</span>
              </span>
            </Card>
            <Card className="flex flex-col gap-1">
              <span className="font-data text-xs uppercase tracking-widest text-ink-soft">
                Diversification
              </span>
              {catalog ? (
                <>
                  <span className="font-display text-3xl text-ink">
                    {distinctProjects}
                    <span className="font-data text-sm text-ink-soft"> projects</span>
                  </span>
                  <span className="font-data text-xs text-ink-soft">
                    {distinctRegistries} registries
                  </span>
                </>
              ) : (
                <span className="font-display text-3xl text-ink">—</span>
              )}
            </Card>
          </div>

          <Card padding="sm" className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="font-data text-[11px] uppercase tracking-widest text-ink-soft border-b border-line">
                  <th className="py-3 pr-4 font-normal">Project</th>
                  <th className="py-3 pr-4 font-normal">Certification</th>
                  <th className="py-3 pr-4 font-normal">
                    <span className="relative inline-flex items-center gap-1.5">
                      AI Score
                      <button
                        type="button"
                        onClick={() => setShowScoreInfo((v) => !v)}
                        aria-label="How the AI Score is calculated"
                        aria-expanded={showScoreInfo}
                        className="w-3.5 h-3.5 rounded-full border border-ink-soft text-ink-soft text-[9px] font-normal normal-case tracking-normal leading-none flex items-center justify-center hover:border-leaf-dark hover:text-leaf-dark transition-colors"
                      >
                        ?
                      </button>
                      {showScoreInfo && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-ink text-paper text-[11px] font-normal normal-case tracking-normal leading-relaxed rounded-lg p-3 z-10 shadow-lg text-left">
                          AI Score = 40% rule-based fundamentals + 60%
                          AI-reasoned analysis, out of 100.
                        </div>
                      )}
                    </span>
                  </th>
                  <th className="py-3 pr-4 font-normal">Tons held</th>
                  <th className="py-3 pr-4 font-normal">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="font-body">
                {tokenIds.map((tokenId, i) => {
                  const credit = catalogByTokenId.get(Number(tokenId));
                  const isExpanded = expandedTokenIds.has(Number(tokenId));
                  return (
                    <Fragment key={tokenId.toString()}>
                      <tr className={`align-top ${isExpanded ? "" : "border-b border-line last:border-0"}`}>
                        <td className="py-3 pr-4">{credit?.projectType ?? `Token #${tokenId}`}</td>
                        <td className="py-3 pr-4">{credit?.certificationStandard ?? "—"}</td>
                        <td className="py-3 pr-4">
                          {credit ? (
                            <div className="flex justify-center">
                              <ScoreBar score={credit.finalScore} hideTotal />
                            </div>
                          ) : (
                            <span className="font-data text-xs text-ink-soft">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 font-data text-sm">{balances[i].toString()}</td>
                        <td className="py-3 pr-4">
                          {credit?.llmRationale && (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(Number(tokenId))}
                              aria-expanded={isExpanded}
                              className="flex items-center gap-1 font-data text-[10px] uppercase tracking-widest text-leaf-dark bg-leaf-pale rounded-full px-2 py-0.5 hover:bg-leaf hover:text-paper transition-colors duration-500 ease-out"
                            >
                              Why
                              <span
                                className={`inline-block transition-transform duration-500 ease-out ${isExpanded ? "rotate-180" : ""}`}
                                aria-hidden
                              >
                                ▾
                              </span>
                            </button>
                          )}
                        </td>
                      </tr>
                      <AnimatePresence initial={false}>
                        {isExpanded && credit?.llmRationale && (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <td colSpan={5} className="pb-4 pr-4 text-left">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="bg-leaf-pale rounded-xl p-4 flex flex-col gap-1.5">
                                  <span className="font-data text-[10px] uppercase tracking-widest text-leaf-dark">
                                    AI Rationale
                                  </span>
                                  <p className="font-body text-sm text-ink-soft leading-relaxed">
                                    {credit.llmRationale}
                                  </p>
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
