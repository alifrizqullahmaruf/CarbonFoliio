import { Wallet, Target, ClipboardList, CheckCircle2, LineChart } from "lucide-react";
import { Card } from "@/components/Card";
import { Reveal } from "@/components/motion/Reveal";

const STEPS = [
  {
    icon: Wallet,
    title: "Connect your wallet",
    body: "Self-custodial: Strata never holds your funds.",
  },
  {
    icon: Target,
    title: "Set a target & risk profile",
    body: "Tons of CO2 to offset, and how conservative to be.",
  },
  {
    icon: ClipboardList,
    title: "Review the recommendation",
    body: "See the chosen credits, their scores, and the reasoning.",
  },
  {
    icon: CheckCircle2,
    title: "Approve, execute on-chain",
    body: "One signed transaction, straight to PortfolioManager.",
  },
  {
    icon: LineChart,
    title: "Track your portfolio",
    body: "See exactly what you hold, whenever you come back.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-mist px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal className="max-w-2xl mb-16">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            The process
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            Five steps.
            <br />
            <span className="text-gradient-leaf">Fully transparent.</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-ink-soft leading-relaxed">
            From connecting your wallet to tracking your holdings, every
            step explained, nothing hidden.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <Card padding="sm" className="h-full">
                <step.icon className="w-5 h-5 text-leaf-dark mb-4" strokeWidth={1.75} />
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
