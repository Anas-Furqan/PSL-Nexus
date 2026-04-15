"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { formatEther, type Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/constants/addresses";
import economyAbi from "@/constants/economyAbi.json";
import landAbi from "@/constants/landAbi.json";
import { useCursorContext } from "./CustomCursor";

const StadiumMetaverse = dynamic(() => import("./StadiumMetaverse"), {
  ssr: false,
});

function formatCompact(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function LandingStadiumPreview() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();
  const { address, isConnected } = useAccount();

  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LAND,
    abi: landAbi as Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 4000,
    },
  });

  const { data: totalStaked } = useReadContract({
    address: CONTRACT_ADDRESSES.ECONOMY,
    abi: economyAbi as Abi,
    functionName: "totalStaked",
    query: {
      refetchInterval: 10000,
    },
  });

  const ownerPlots = Number(nftBalance ?? BigInt(0));
  const isOwner = isConnected && ownerPlots > 0;

  const insightCards = [
    {
      title: "WireFluid Profile",
      value: "Chain 92533",
      detail: "Instant-finality EVM testnet",
    },
    {
      title: "Nexus Economy",
      value: `${formatCompact(Number(formatEther((totalStaked as bigint | undefined) ?? BigInt(0))))} NEXUS`,
      detail: "Total staked on protocol",
    },
    {
      title: "Submission Track",
      value: "Entangled 2026",
      detail: "Dettol Warriors - Production Build",
    },
  ];

  return (
    <section id="stadium-preview" className="relative z-2 py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="landing-stadium-shell">
          <div className="landing-stadium-copy">
            <div className="font-share-tech text-[0.62rem] tracking-[0.35em] text-neon-green uppercase mb-4">
              PSL Nexus Stadium Twin
            </div>
            <h2 className="font-orbitron font-bold text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[1.1] mb-4">
              Stadium Preview with Live Ownership Status
            </h2>
            <p className="text-[1rem] text-text-muted leading-relaxed max-w-[560px]">
              Scan your digital stadium presence before entering the dashboard. Connected land owners unlock premium yield and highlighted ownership zones.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
              {insightCards.map((card) => (
                <div key={card.title} className="landing-insight-card">
                  <div className="landing-insight-title">{card.title}</div>
                  <div className="landing-insight-value">{card.value}</div>
                  <div className="landing-insight-detail">{card.detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/dashboard"
                className="btn-clip-primary inline-block"
                onMouseEnter={onCursorEnter}
                onMouseLeave={onCursorLeave}
              >
                Enter Dashboard
              </Link>
            </div>
          </div>

          <div className="landing-stadium-visual">
            <div className="landing-stadium-canvas-wrap">
              <StadiumMetaverse embedded />
              <div className={`landing-owner-overlay ${isOwner ? "is-owner" : ""}`}>
                Status: {isOwner ? "Land Owner" : "Spectator"}
              </div>
            </div>
            <div className="landing-stadium-legend">
              <span>Owned Plots: {ownerPlots}</span>
              <span>{isConnected ? "Wallet Connected" : "Connect wallet to verify"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
