"use client";

import { useScoredCredits } from "@/hooks/useScoredCredits";
import { PageHeading } from "@/components/PageHeading";
import { Card } from "@/components/Card";
import { StatusMessage } from "@/components/StatusMessage";
import { Button, LinkButton } from "@/components/Button";
import { formatOkb } from "@/lib/format";
import { confidenceToBand, bandTextClass } from "@/lib/scoreBand";
import { REFERENCE_CREDITS } from "@/lib/referenceCredits";

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}

export default function CatalogPage() {
  const { credits, error } = useScoredCredits();

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full">
      <PageHeading
        eyebrow="Field record"
        title="Carbon Credit Catalog"
        description={
          <>
            Every credit worth knowing about — live from{" "}
            <code className="font-data text-sm">MockCarbonCredit</code> on X
            Layer, alongside real, retired projects from Verra, ACR and CAR
            for comparison. Rows you can allocate right now show an
            &quot;Allocate&quot; button.
          </>
        }
      />

      {error && <StatusMessage variant="error">Error: {error}</StatusMessage>}
      {!error && !credits && <StatusMessage variant="loading">Reading the chain…</StatusMessage>}

      {credits && (
        <Card padding="sm" className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="font-data text-[11px] uppercase tracking-widest text-ink-soft border-b border-line">
                <th className="py-3 pr-4 font-normal">Project</th>
                <th className="py-3 pr-4 font-normal">Certification</th>
                <th className="py-3 pr-4 font-normal">Location</th>
                <th className="py-3 pr-4 font-normal">Detail</th>
                <th className="py-3 pr-4 font-normal" />
              </tr>
            </thead>
            <tbody className="font-body">
              {credits?.map((c) => (
                <tr key={`demo-${c.tokenId}`} className="border-b border-line last:border-0 align-top">
                  <td className="py-3 pr-4">{c.projectType}</td>
                  <td className="py-3 pr-4">{c.certificationStandard}</td>
                  <td className="py-3 pr-4">{c.location}</td>
                  <td
                    className={`py-3 pr-4 font-data text-sm whitespace-nowrap ${bandTextClass(confidenceToBand(c.confidence))}`}
                  >
                    {c.finalScore} pts · {formatOkb(c.priceWei)} OKB
                  </td>
                  <td className="py-3 pr-4">
                    <LinkButton href="/recommend" size="sm">
                      Allocate
                    </LinkButton>
                  </td>
                </tr>
              ))}
              {REFERENCE_CREDITS.map((c) => (
                <tr key={`ref-${c.projectId}`} className="border-b border-line last:border-0 align-top">
                  <td className="py-3 pr-4 max-w-xs">{c.name}</td>
                  <td className="py-3 pr-4">{c.registry}</td>
                  <td className="py-3 pr-4">{c.country}</td>
                  <td className="py-3 pr-4 font-data text-sm text-ink-soft whitespace-nowrap">
                    {formatCompact(c.retired)} t retired
                  </td>
                  <td className="py-3 pr-4">
                    <Button size="sm" variant="ghost" disabled>
                      Coming soon
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
