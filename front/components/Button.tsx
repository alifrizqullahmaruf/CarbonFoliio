import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const BASE =
  "font-data uppercase tracking-widest rounded-full transition-opacity disabled:opacity-50 whitespace-nowrap";
const VARIANT_CLASS = {
  primary: "gradient-leaf text-paper hover:opacity-90",
  ghost: "border border-line text-ink-soft",
} as const;
const SIZE_CLASS = {
  md: "px-6 py-3 text-sm",
  sm: "px-3 py-1 text-[10px]",
} as const;

type Variant = keyof typeof VARIANT_CLASS;
type Size = keyof typeof SIZE_CLASS;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** A styled `<button>` — for submit/action buttons inside client components. */
export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={`${BASE} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`} {...props} />;
}

/** A styled `<Link>` — for navigation CTAs, usable from server components too. */
export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 ${BASE} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
