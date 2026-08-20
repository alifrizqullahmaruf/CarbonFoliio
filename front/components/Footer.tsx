import Link from "next/link";

const LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/recommend", label: "Recommend" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Footer() {
  return (
    <footer className="bg-paper border-t border-line px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-line">
          <div>
            <p className="font-display text-lg text-ink mb-1">Strata</p>
            <p className="font-body text-sm text-ink-soft max-w-xs">
              An instrument for reading the carbon market.
            </p>
          </div>
          <nav className="flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-data text-xs uppercase tracking-widest text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-6">
          <p className="font-data text-xs text-ink-soft">
            © {new Date().getFullYear()} Strata. Built on X Layer.
          </p>
          <span className="font-data text-xs uppercase tracking-widest text-leaf-dark">
            X Layer Testnet
          </span>
        </div>
      </div>
    </footer>
  );
}
