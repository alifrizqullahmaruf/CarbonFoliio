import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, okxWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { xLayer } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Strata",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [xLayer],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, okxWallet, walletConnectWallet],
    },
  ],
  ssr: true,
});
