"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ITEMS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/recommend", label: "Recommend" },
  { href: "/portfolio", label: "Portfolio" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-paper border border-line rounded-full shadow-lg pl-4 pr-1.5 py-1.5 max-w-[calc(100vw-1.5rem)] overflow-x-auto">
      <div className="flex items-center gap-3 flex-nowrap whitespace-nowrap w-max">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] whitespace-nowrap transition-colors ${
                active ? "text-leaf-dark" : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <ConnectButton showBalance={false} accountStatus="avatar" />
      </div>
    </nav>
  );
}
