import { Reveal } from "@/components/motion/Reveal";

const OFFERINGS = [
  {
    tag: "Scoring",
    title: "Rule + AI scoring",
    body: "Every credit scored on fundamentals, then reasoned over by an LLM for context rules alone can't catch.",
  },
  {
    tag: "Allocation",
    title: "Risk-matched portfolios",
    body: "Set a target and a risk profile: the engine assembles the mix that fits.",
  },
  {
    tag: "Execution",
    title: "On-chain, self-custodial",
    body: "One signed transaction, straight to PortfolioManager. Strata never holds your funds.",
  },
  {
    tag: "Transparency",
    title: "Reasoning, not a black box",
    body: "Every score and every allocation ships with the reasoning shown, not hidden.",
  },
];

export function WhatWeOffer() {
  return (
    <section className="bg-mist px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            What we offer
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-16 max-w-2xl">
            Everything a portfolio needs,{" "}
            <span className="text-gradient-leaf">fully instrumented.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {OFFERINGS.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08} className="border-l border-line pl-5">
              <span className="font-data text-xs uppercase tracking-widest text-ink-soft block mb-3">
                {o.tag}
              </span>
              <h3 className="font-display text-xl text-ink mb-2">{o.title}</h3>
              <p className="font-body text-sm text-ink-soft leading-relaxed">
                {o.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
