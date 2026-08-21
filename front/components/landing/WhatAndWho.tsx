import { Reveal } from "@/components/motion/Reveal";

const LAYERS = [
  {
    label: "01 · Score",
    title: "Credit Quality",
    body: "Every credit is scored on rule-based fundamentals and AI-reasoned context, including vintage, certification, and project type, so you're never guessing what you're buying.",
    accent: "var(--leaf)",
  },
  {
    label: "02 · Build",
    title: "Portfolio Construction",
    body: "Set a target and a risk profile. The engine assembles a diversified allocation across scored credits, with the reasoning shown at every layer.",
    accent: "var(--gold)",
  },
];

export function WhatAndWho() {
  return (
    <section className="relative bg-leaf-pale px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-12 items-start">
        <Reveal className="relative z-10">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            The method
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            <span className="text-gradient-leaf">Score first.</span>
            <br />
            Build second.
          </h2>
          <p className="font-body text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed">
            Two layers stand between raw credit data and a portfolio you can
            defend.
          </p>
        </Reveal>

        <div className="flex flex-col">
          {LAYERS.map((layer, i) => (
            <Reveal
              key={layer.title}
              delay={i * 0.12}
              className="flex gap-5 py-8 border-t border-line first:border-t-0 first:pt-0"
            >
              <div
                className="w-1 rounded-full shrink-0"
                style={{ background: layer.accent }}
                aria-hidden
              />
              <div>
                <span
                  className="font-data text-xs uppercase tracking-widest block mb-2"
                  style={{ color: layer.accent }}
                >
                  {layer.label}
                </span>
                <h3 className="font-display text-xl text-ink mb-2">
                  {layer.title}
                </h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  {layer.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
