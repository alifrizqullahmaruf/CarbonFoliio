import Image from "next/image";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section className="relative bg-mist px-6 md:px-10 py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <Reveal mode="mount" className="relative z-10">
          <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
            AI-RWA · X Layer
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-ink mb-6">
            <span className="text-gradient-leaf">AI-managed</span>
            <br />
            carbon credit portfolios.
          </h1>
          <p className="font-body text-lg md:text-xl text-ink-soft max-w-2xl mb-10 leading-relaxed">
            Scored, diversified, and explained. Built on X Layer.
          </p>
          <LinkButton href="/catalog">Browse the catalog →</LinkButton>
        </Reveal>

        <Reveal mode="mount" delay={0.15} className="relative min-h-75 md:min-h-150">
          <Image
            src="/earth3.gif"
            alt="Earth"
            width={2000}
            height={2000}
            unoptimized
            priority
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-150 md:w-[165%] md:max-w-none h-auto"
          />
        </Reveal>
      </div>
    </section>
  );
}
