"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="font-data text-xs uppercase tracking-widest text-error mb-4">
        Something went wrong
      </p>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
        An unexpected error occurred.
      </h1>
      <p className="font-body text-lg text-ink-soft max-w-xl mb-10 leading-relaxed">
        Try again, or head back to the homepage if the problem persists.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
