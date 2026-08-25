import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-4">
        404
      </p>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
        This page doesn&apos;t exist.
      </h1>
      <p className="font-body text-lg text-ink-soft max-w-xl mb-10 leading-relaxed">
        The page you&apos;re looking for isn&apos;t here. It may have moved, or
        the link might be wrong.
      </p>
      <LinkButton href="/">Back to home →</LinkButton>
    </div>
  );
}
