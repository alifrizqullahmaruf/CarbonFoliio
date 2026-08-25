"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Nav() {
  return (
    <header className="hidden sm:block fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-40 bg-paper border border-line rounded-full shadow-lg px-5 md:px-8 py-2">
      <div className="flex items-center gap-4 md:gap-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/LogoCircle.png"
            alt="Strata"
            width={2000}
            height={2000}
            priority
            className="h-10 w-10 object-contain"
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
