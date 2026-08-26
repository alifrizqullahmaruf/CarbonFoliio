"use client";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/chain/wagmiConfig";

const queryClient = new QueryClient();

const rainbowKitTheme = lightTheme({
  accentColor: "#3d8b40",
  accentColorForeground: "#ffffff",
  borderRadius: "large",
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          <MotionConfig reducedMotion="user">
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                style: { fontFamily: "var(--font-body)" },
              }}
            />
          </MotionConfig>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
