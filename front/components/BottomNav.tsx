"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

const ITEMS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/recommend", label: "Recommend" },
  { href: "/portfolio", label: "Portfolio" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-paper border border-line rounded-full shadow-lg pl-5 pr-2 py-2 max-w-[calc(100vw-1.5rem)] overflow-x-auto">
      <div className="flex items-center gap-4 flex-nowrap whitespace-nowrap w-max">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                active ? "text-leaf-dark" : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <button
                type="button"
                onClick={connected ? openAccountModal : openConnectModal}
                aria-label={connected ? "Account" : "Connect wallet"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  connected
                    ? "bg-leaf-pale text-leaf-dark"
                    : "bg-leaf text-white hover:bg-leaf-dark"
                }`}
                style={!ready ? { opacity: 0, pointerEvents: "none" } : undefined}
              >
                <Wallet className="h-4.5 w-4.5" />
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
