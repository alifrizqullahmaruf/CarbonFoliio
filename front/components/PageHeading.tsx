import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <>
      <p className="font-data text-xs uppercase tracking-widest text-leaf-dark mb-3">{eyebrow}</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">{title}</h1>
      {description && (
        <p className="font-body text-ink-soft mb-10 max-w-2xl">{description}</p>
      )}
    </>
  );
}
