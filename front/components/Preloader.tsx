"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const STORAGE_KEY = "strata-preloader-seen";
const DURATION_MS = 1200;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    // One-time read of a browser-only API (sessionStorage) on mount to decide
    // whether this is a repeat visit — there's no way to know this during SSR.
    if (sessionStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => setVisible(false), 250);
      }
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-mist overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/earth3.gif"
              alt="Earth"
              width={1200}
              height={1200}
              unoptimized
              priority
              className="h-72 w-72 md:h-96 md:w-96 object-contain"
            />
          </motion.div>
          <div className="relative flex flex-col items-center gap-2 w-64">
            <div className="w-full h-2 rounded-full bg-line overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(135deg, var(--leaf), var(--leaf-dark))",
                }}
              />
            </div>
            <span className="font-data text-sm uppercase tracking-widest text-leaf-dark">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
