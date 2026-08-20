import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, okxWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { xLayerTestnet } from "./xLayerTestnet";

export const wagmiConfig = getDefaultConfig({
  appName: "Strata",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [xLayerTestnet],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, okxWallet, walletConnectWallet],
    },
  ],
  ssr: true,
});
