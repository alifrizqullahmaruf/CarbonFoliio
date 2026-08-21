import { Card } from "@/components/Card";
import { Reveal } from "@/components/motion/Reveal";

const PERSONAS = [
  {
    title: "Corporate Sustainability Officer",
    body: "Offset your company's emissions with credits you can defend in an audit: every score comes with a reason.",
  },
  {
    title: "Web3-Native Investor",
    body: "Diversify into real-world carbon assets without becoming a certification-methodology expert first.",
  },
  {
    title: "DAO Treasury",
    body: "Allocate part of your treasury to verified climate impact, on-chain, without manual research each time.",
  },
];

export function BuiltFor() {
  return (
    <section className="relative bg-leaf-pale px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-12 items-start">
        <Reveal className="relative z-10">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            Who it&apos;s for
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            <span className="text-gradient-leaf">Same instrument.</span>
            <br />
            Different mandates.
          </h2>
          <p className="font-body text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed">
            Closing the books, building a treasury, or diversifying into
            real-world assets: Strata gives every mandate the same
            explainable process.
          </p>
        </Reveal>

        <div className="flex flex-col gap-4">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <Card>
                <p className="font-display text-lg text-ink mb-2">{p.title}</p>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  {p.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
