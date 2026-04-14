"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const phases = [
  {
    phase: "Phase 01",
    title: "Environment Setup",
    items: ["Hardhat config", "Wirefluid RPC", "Testnet faucet"],
    status: "done" as const,
  },
  {
    phase: "Phase 02",
    title: "Core Contracts",
    items: ["NexusIdentity", "NexusEconomy", "NexusOracle"],
    status: "done" as const,
  },
  {
    phase: "Phase 03",
    title: "Metaverse Assets",
    items: ["3D stadium model", "NFT plot mapping", "WebGL export"],
    status: "current" as const,
  },
  {
    phase: "Phase 04",
    title: "Integration",
    items: ["Frontend + chain", "Gasless via Paymaster", "QR payment flow"],
    status: "future" as const,
  },
  {
    phase: "Phase 05–07",
    title: "Launch & Scale",
    items: ["Stress test 1000 TPS", "Audit report", "Whitepaper + video"],
    status: "future" as const,
  },
];

function getDotClasses(status: "done" | "current" | "future") {
  const base =
    "w-3.5 h-3.5 rounded-full border-2 border-dark-bg mb-6 relative transition-transform duration-300 group-hover:scale-150";
  if (status === "done") {
    return `${base} bg-neon-cyan shadow-[0_0_30px_rgba(0,255,136,0.3),0_0_60px_rgba(0,255,136,0.1)]`;
  }
  if (status === "current") {
    return `${base} bg-neon-green shadow-[0_0_30px_rgba(0,255,136,0.3),0_0_60px_rgba(0,255,136,0.1)]`;
  }
  return `${base} roadmap-dot-future`;
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative z-2 border-t border-border-neon">
      <div className="max-w-[1200px] mx-auto px-6 md:px-15 py-20 md:py-30">
        <SectionHeader
          tag="Development"
          title="7-Phase"
          accent="Launch Plan"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7 }}
          className="mt-15 relative"
        >
          {/* Horizontal line — hidden on mobile */}
          <div
            className="hidden md:block absolute top-[28px] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, var(--color-neon-green), var(--color-neon-cyan), var(--color-neon-acid), transparent)",
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0 relative">
            {phases.map((phase, i) => (
              <div key={i} className="px-0 md:px-5 group">
                <div className={getDotClasses(phase.status)} />
                <div className="font-share-tech text-[0.6rem] tracking-[0.3em] text-neon-green uppercase mb-2">
                  {phase.phase}
                </div>
                <div className="font-orbitron text-[0.85rem] font-bold text-text-primary mb-2.5 leading-[1.3]">
                  {phase.title}
                </div>
                <ul className="list-none">
                  {phase.items.map((item, j) => (
                    <li
                      key={j}
                      className="font-share-tech text-[0.65rem] text-text-muted py-0.5 tracking-[0.05em]"
                    >
                      <span className="text-neon-green">— </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
