import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // RainbowKit's bundled Coinbase/Base Account connector pulls in
  // @coinbase/cdp-sdk, which has an unresolvable dynamic import for an
  // optional Solana/x402 payment path we never use. Opting it (and its
  // dependent) out of SSR bundling avoids Turbopack failing to statically
  // resolve that dead code path.
  serverExternalPackages: ["@coinbase/cdp-sdk", "@base-org/account"],
};

export default nextConfig;
