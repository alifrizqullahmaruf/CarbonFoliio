"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Nav() {
  return (
    <header className="bg-paper border-b border-line px-4 md:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
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
        <nav className="hidden sm:flex items-center gap-1 bg-leaf-pale rounded-full px-2 py-1.5">
          <Link
            href="/catalog"
            className="px-4 py-1.5 rounded-full text-sm text-ink-soft hover:text-ink hover:bg-paper transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/recommend"
            className="px-4 py-1.5 rounded-full text-sm text-ink-soft hover:text-ink hover:bg-paper transition-colors"
          >
            Recommend
          </Link>
          <Link
            href="/portfolio"
            className="px-4 py-1.5 rounded-full text-sm text-ink-soft hover:text-ink hover:bg-paper transition-colors"
          >
            Portfolio
          </Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
}
