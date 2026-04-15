"use client";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  type Theme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { defineChain } from "viem";
import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* ── WireFluid Testnet ── */
const wirefluidTestnet = defineChain({
  id: 92533,
  name: "WireFluid Testnet",
  nativeCurrency: {
    name: "WIRE",
    symbol: "WIRE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://evm.wirefluid.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "WireFluid Scan",
      url: "https://wirefluidscan.com/",
    },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: "PSL NEXUS",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "c1272830b5fe65cf8e5619fe7f1532f5",
  chains: [wirefluidTestnet],
  transports: {
    [wirefluidTestnet.id]: http("https://evm.wirefluid.com"),
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#07150f",
              color: "#e8ffe8",
              border: "1px solid rgba(0, 255, 136, 0.25)",
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
