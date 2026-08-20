import type { ReactNode } from "react";

const VARIANT_CLASS = {
  loading: "font-data text-sm text-ink-soft",
  error: "font-data text-sm text-error",
  note: "font-data text-sm text-gold",
} as const;

export function StatusMessage({
  variant,
  children,
}: {
  variant: keyof typeof VARIANT_CLASS;
  children: ReactNode;
}) {
  return <p className={VARIANT_CLASS[variant]}>{children}</p>;
}
