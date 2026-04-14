"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useCursorContext } from "./CustomCursor";

const features = [
  {
    num: "01 / IDENTITY",
    icon: "🔐",
    title: "NexusIdentity.sol",
    desc: "ERC-4337 Account Abstraction — fans login via email, wallet created silently. Zero friction onboarding. ZK-Proofs protect every identity.",
    tag: "ERC-4337 · ZK-PROOF",
  },
  {
    num: "02 / ECONOMY",
    icon: "💎",
    title: "NexusEconomy.sol",
    desc: "ERC-20 $NEXUS tokens with 0.5% daily Fan Yield staking. ERC-721 Stadium Land NFTs. Aave-style liquidity pools for DeFi yield farming.",
    tag: "ERC-20 · ERC-721 · DEFI",
  },
  {
    num: "03 / ORACLE",
    icon: "⚡",
    title: "NexusOracle.sol",
    desc: "Live Cricinfo / API-Football bridge. Match events trigger automated $NEXUS payouts in real-time. Every six, every wicket — instant reward.",
    tag: "ORACLE · REAL-TIME",
  },
  {
    num: "04 / METAVERSE",
    icon: "🏟️",
    title: "3D Stadium Lobby",
    desc: "WebVR stadium in Three.js. No downloads. Runs in browser. 10×10 land grid — each tile an NFT. Watch matches from your virtual box seat.",
    tag: "THREE.JS · WEBVR",
  },
  {
    num: "05 / PAYMENTS",
    icon: "📲",
    title: "QR Instant Pay",
    desc: "Scan a QR at the stadium food stall — instant $NEXUS transfer, gasless via Paymaster. Fans never pay fees. PCB earns 2% on every transaction.",
    tag: "GASLESS · PAYMASTER",
  },
  {
    num: "06 / SECURITY",
    icon: "🛡️",
    title: "Audit-Grade Code",
    desc: "Slither + Mythril automated audit pipeline. 100% Hardhat test coverage. Foundry fuzzing. Every contract verified on Wirefluid block explorer.",
    tag: "SLITHER · MYTHRIL",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
    },
  }),
};

export default function Features() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  return (
    <section id="features" className="relative z-2 border-t border-border-neon">
      <div className="max-w-[1200px] mx-auto px-6 md:px-15 py-20 md:py-30">
        <SectionHeader
          tag="Core Modules"
          title="Three Pillars of"
          accent="NEXUS"
        />

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px mt-15 border border-border-neon"
          style={{ background: "rgba(0,255,136,0.2)" }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
              className="bg-dark-bg p-10 md:p-12 relative overflow-hidden transition-colors duration-400 hover:bg-dark-panel feature-card-hover cursor-none"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              <span className="font-orbitron text-[0.6rem] tracking-[0.3em] text-border-neon mb-4 block">
                {feature.num}
              </span>
              <span
                className="text-[2.5rem] mb-6 block"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(0,255,136,0.5))",
                }}
              >
                {feature.icon}
              </span>
              <div className="font-orbitron text-[1rem] font-bold text-text-primary mb-3 tracking-[0.05em]">
                {feature.title}
              </div>
              <p className="text-[0.95rem] text-text-muted leading-[1.7] font-light">
                {feature.desc}
              </p>
              <span className="inline-block mt-5 font-share-tech text-[0.6rem] tracking-[0.2em] text-neon-cyan border border-[rgba(0,229,255,0.2)] px-3 py-1 uppercase">
                {feature.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
