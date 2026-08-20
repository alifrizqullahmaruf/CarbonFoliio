"use client";

import { useEffect, useState } from "react";
import type { ScoredCreditDTO } from "@/lib/scoring/clientTypes";

/** Fetches the scored credit catalog once on mount. `credits` stays null until the request settles. */
export function useScoredCredits() {
  const [credits, setCredits] = useState<ScoredCreditDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/credits/score")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setCredits)
      .catch((err) => setError(err instanceof Error ? err.message : "Unknown error"));
  }, []);

  return { credits, error };
}
