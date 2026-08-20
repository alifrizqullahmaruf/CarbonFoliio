import { Card } from "@/components/Card";
import { Reveal } from "@/components/motion/Reveal";

const STEPS = [
  { title: "Connect your wallet", body: "Self-custodial — Strata never holds your funds." },
  { title: "Set a target & risk profile", body: "Tons of CO2 to offset, and how conservative to be." },
  { title: "Review the recommendation", body: "See the chosen credits, their scores, and the reasoning." },
  { title: "Approve — execute on-chain", body: "One signed transaction, straight to PortfolioManager." },
  { title: "Track your portfolio", body: "See exactly what you hold, whenever you come back." },
];

export function HowItWorks() {
  return (
    <section className="bg-paper px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-12">
            How it works
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <Card padding="sm" className="h-full">
                <span className="font-data text-xs text-leaf-dark block mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-base text-ink mb-1">
                  {step.title}
                </p>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  {step.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
