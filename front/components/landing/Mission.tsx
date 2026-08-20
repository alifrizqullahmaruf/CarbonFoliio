import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Mission() {
  return (
    <section className="bg-ink px-6 md:px-10 py-20 md:py-28">
      <Reveal className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl leading-tight text-paper mb-6">
          Carbon markets only work if buyers can{" "}
          <span className="text-gradient-leaf">trust the score.</span>
        </h2>
        <p className="font-body text-lg text-paper/70 mb-10 leading-relaxed">
          Strata exists to make that trust automatic — every credit, every
          allocation, explained.
        </p>
        <LinkButton href="/catalog">Browse the catalog →</LinkButton>
      </Reveal>
    </section>
  );
}
