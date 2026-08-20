import type { Metadata } from "next";
import { Bitter, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Logo from "@/public/LogoStrata.png"

const bitter = Bitter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "variable",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  icons: Logo.src,
  title: "Strata",
  description: "An instrument for reading the carbon market — AI-scored, on-chain carbon credit portfolios on X Layer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bitter.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body">
        <Providers>
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
