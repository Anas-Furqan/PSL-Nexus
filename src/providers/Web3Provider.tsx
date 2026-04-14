"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  type Theme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { defineChain } from "viem";
import { type ReactNode } from "react";

/* ── Wirefluid Testnet (Placeholder) ── */
const wirefluidTestnet = defineChain({
  id: 77777,
  name: "Wirefluid Testnet",
  nativeCurrency: {
    name: "Wirefluid",
    symbol: "WFL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.wirefluid.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Wirefluid Explorer",
      url: "https://explorer-testnet.wirefluid.com",
    },
  },
  testnet: true,
});

const config = createConfig({
  chains: [wirefluidTestnet],
  transports: {
    [wirefluidTestnet.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

/* ── Custom RainbowKit Theme ── */
const nexusTheme: Theme = {
  ...darkTheme({
    accentColor: "#00ff88",
    accentColorForeground: "#030a06",
    borderRadius: "none",
  }),
  colors: {
    ...darkTheme().colors,
    modalBackground: "#030a06",
    modalBorder: "rgba(0, 255, 136, 0.2)",
    profileAction: "#030a06",
    profileActionHover: "rgba(0, 255, 136, 0.05)",
    connectButtonBackground: "#00ff88",
    connectButtonText: "#030a06",
  },
  fonts: {
    body: "var(--font-rajdhani), sans-serif",
  },
};

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={nexusTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
