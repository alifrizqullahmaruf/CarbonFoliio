import Image from "next/image";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section className="relative bg-mist px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <Reveal mode="mount" className="relative z-10">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            AI-RWA · X Layer Testnet
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            <span className="text-gradient-leaf">AI-managed</span>
            <br />
            carbon credit portfolios.
          </h1>
          <p className="font-body text-lg md:text-xl text-ink-soft max-w-2xl mb-10 leading-relaxed">
            Scored, diversified, and explained — built on X Layer.
          </p>
          <LinkButton href="/catalog">Browse the catalog →</LinkButton>
        </Reveal>

        <Reveal mode="mount" delay={0.15} className="relative min-h-70 md:min-h-140">
          <Image
            src="/earth3.gif"
            alt="Earth"
            width={1200}
            height={1200}
            unoptimized
            priority
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-140 md:w-[150%] md:max-w-none h-auto"
          />
        </Reveal>
      </div>
    </section>
  );
}
