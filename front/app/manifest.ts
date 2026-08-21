import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Strata",
    short_name: "Strata",
    description:
      "An instrument for reading the carbon market — AI-scored, on-chain carbon credit portfolios on X Layer.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5fb93c",
    icons: [
      {
        src: "/LogoStrata.png",
        sizes: "2000x2000",
        type: "image/png",
      },
    ],
  };
}
