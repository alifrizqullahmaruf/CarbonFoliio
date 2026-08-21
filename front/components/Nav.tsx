"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Nav() {
  return (
    <header className="bg-paper border-b border-line px-6 md:px-10 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/LogoStrata.png"
            alt="Strata"
            width={2000}
            height={2000}
            priority
            className="h-24 w-24 object-contain"
          />
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/recommend"
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            Recommend
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            Portfolio
          </Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
}
