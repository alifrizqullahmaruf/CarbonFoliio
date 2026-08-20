import type { ReactNode } from "react";

const PADDING_CLASS = {
  sm: "p-4 md:p-6",
  md: "p-6",
} as const;

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: keyof typeof PADDING_CLASS;
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`bg-paper rounded-2xl border border-line ${PADDING_CLASS[padding]} ${className}`}>
      {children}
    </div>
  );
}
