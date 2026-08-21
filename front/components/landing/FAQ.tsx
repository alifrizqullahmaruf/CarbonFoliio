"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";

const FAQS_LEFT = [
  {
    q: "How does Strata's AI actually score a credit?",
    a: "Every credit gets two independent signals: a rule-based score from hard facts (certification standard, vintage, project type) and an AI-reasoned score from an LLM that reads the same metadata for context rules alone can't catch. The two combine into one final score, weighted 40% rule-based and 60% AI-reasoned.",
  },
  {
    q: "Can I see why the AI recommended a specific credit?",
    a: "Yes. Every score and every allocation ships with a written rationale, not just a number. Every credit has a “Why” you can open to read the reasoning before you approve anything.",
  },
  {
    q: "Does Strata ever hold my funds?",
    a: "No. Strata is fully self-custodial. Approving a recommendation sends one signed transaction straight to the PortfolioManager smart contract from your own wallet. Strata's servers never touch your funds.",
  },
];

const FAQS_RIGHT = [
  {
    q: "What happens if no credits meet my risk profile?",
    a: "Strata reports the shortfall honestly instead of quietly filling the gap with lower-quality credits. You'll see exactly how many tons couldn't be matched, and can try a less conservative risk profile.",
  },
  {
    q: "Is this running on real money right now?",
    a: "Not yet. Strata's contracts are live on X Layer Testnet, using the network's test token (OKB), so anyone can try the full flow risk-free before mainnet.",
  },
  {
    q: "Where does the credit data come from?",
    a: "Credit metadata is modeled on real-world formats used by tokenized carbon registries like Toucan Protocol/TCO2 (certification standard, vintage year, project type), so scoring works the same way it would against real on-chain credit data.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-line first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 py-5 text-left"
      >
        <span className="font-display text-lg text-ink">{item.q}</span>
        <span
          className={`shrink-0 font-data text-leaf-dark transition-transform duration-300 ease-out ${isOpen ? "rotate-45" : ""}`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-ink-soft leading-relaxed pb-6">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className="bg-leaf-pale px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal className="mb-12">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            Questions
          </p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink">
            Frequently asked.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-x-12">
          <div className="flex flex-col">
            {FAQS_LEFT.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <FAQItem
                  item={item}
                  isOpen={openKey === `l${i}`}
                  onToggle={() => setOpenKey((k) => (k === `l${i}` ? null : `l${i}`))}
                />
              </Reveal>
            ))}
          </div>
          <div className="flex flex-col">
            {FAQS_RIGHT.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <FAQItem
                  item={item}
                  isOpen={openKey === `r${i}`}
                  onToggle={() => setOpenKey((k) => (k === `r${i}` ? null : `r${i}`))}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
