"use client";

import { motion } from "framer-motion";
import { useCursorContext } from "./CustomCursor";

const layers = [
  {
    icon: "🌐",
    name: "FRONTEND LAYER",
    tech: "Next.js · Tailwind · Three.js · Wagmi",
    color: "var(--color-neon-green)",
    borderColor: "rgba(0,255,136,0.5)",
    bgColor: "rgba(0,255,136,0.05)",
  },
  {
    icon: "⛓️",
    name: "SMART CONTRACT LAYER",
    tech: "Solidity ^0.8.20 · ERC-4337 / 20 / 721",
    color: "var(--color-neon-cyan)",
    borderColor: "rgba(0,229,255,0.5)",
    bgColor: "rgba(0,229,255,0.04)",
  },
  {
    icon: "🔗",
    name: "WIREFLUID NETWORK",
    tech: "EVM-Equivalent L1 · Instant Finality",
    color: "var(--color-neon-acid)",
    borderColor: "rgba(170,255,0,0.5)",
    bgColor: "rgba(170,255,0,0.04)",
  },
  {
    icon: "📡",
    name: "INDEXING & ORACLES",
    tech: "The Graph · Node.js Worker · Cricinfo API",
    color: "var(--color-text-primary)",
    borderColor: "rgba(0,255,136,0.3)",
    bgColor: "rgba(0,255,136,0.03)",
  },
  {
    icon: "🗄️",
    name: "DATA LAYER",
    tech: "MongoDB · IPFS · Metadata Storage",
    color: "var(--color-text-primary)",
    borderColor: "rgba(0,229,255,0.3)",
    bgColor: "rgba(0,229,255,0.03)",
  },
];

const archPoints = [
  "React/Next.js frontend connects to Wirefluid via Ethers.js — same tooling as mainnet Ethereum, zero re-learning.",
  "Three smart contracts handle identity, economy, and real-world data feeds with clean separation of concerns.",
  "The Graph indexes all on-chain events — millisecond query latency for leaderboards and live stats.",
  "MongoDB stores user profiles and NFT metadata off-chain to keep gas costs near zero.",
  "Node.js oracle worker polls sports APIs every 10 seconds and submits signed transactions autonomously.",
];

export default function Architecture() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  return (
    <section
      id="architecture"
      className="relative z-2 border-t border-border-neon"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-15 py-20 md:py-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-share-tech text-[0.65rem] tracking-[0.4em] text-neon-green uppercase mb-4 flex items-center gap-3 section-tag-line">
              System Design
            </div>
            <h2 className="font-orbitron font-bold text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] mb-5">
              Full-Stack{" "}
              <span
                className="text-neon-green"
                style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
              >
                Architecture
              </span>
            </h2>
            <ul className="list-none mt-8">
              {archPoints.map((point, i) => (
                <li
                  key={i}
                  className="text-[1rem] text-text-muted py-4 border-b border-[rgba(0,255,136,0.08)] flex gap-4 items-start leading-relaxed"
                >
                  <span
                    className="text-neon-green shrink-0 mt-0.5"
                    style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
                  >
                    ▸
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.7 }}
            className="relative h-[500px]"
          >
            {layers.map((layer, i) => (
              <div key={i}>
                {/* Layer */}
                <div
                  className="absolute left-0 right-0 flex items-center gap-4 p-4 px-6 border transition-all duration-300 hover:translate-x-2 cursor-none"
                  style={{
                    top: `${i * 100}px`,
                    borderColor: layer.borderColor,
                    background: layer.bgColor,
                  }}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                >
                  <span className="text-[1.5rem] shrink-0">{layer.icon}</span>
                  <div>
                    <div
                      className="font-orbitron text-[0.75rem] font-bold tracking-[0.1em]"
                      style={{ color: layer.color }}
                    >
                      {layer.name}
                    </div>
                    <div className="font-share-tech text-[0.6rem] tracking-[0.15em] text-text-muted mt-0.5">
                      {layer.tech}
                    </div>
                  </div>
                </div>

                {/* Connector (except after last layer) */}
                {i < layers.length - 1 && (
                  <div
                    className="arch-connector"
                    style={{
                      top: `${i * 100 + 56}px`,
                      height: "44px",
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
