import type { Metadata } from "next";
import { Bitter, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { BottomNav } from "@/components/BottomNav";

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

const description =
  "An instrument for reading the carbon market — AI-scored, on-chain carbon credit portfolios on X Layer.";

export const metadata: Metadata = {
  metadataBase: new URL("https://strata-carbon.vercel.app"),
  icons: "/LogoCircle.png",
  title: "Strata",
  description,
  openGraph: {
    title: "Strata",
    description,
    images: ["/Strata_AI_Carbon_Portfolios_page-0001.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strata",
    description,
    images: ["/Strata_AI_Carbon_Portfolios_page-0001.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bitter.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body pt-0 sm:pt-24 md:pt-28 pb-24 sm:pb-0">
        <Providers>
          <Preloader />
          <Nav />
          {children}
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
