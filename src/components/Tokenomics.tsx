"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useCursorContext } from "./CustomCursor";

const tokens = [
  {
    pct: "40%",
    name: "Fan Rewards",
    desc: "Prediction wins, staking yield, match attendance rewards",
  },
  {
    pct: "25%",
    name: "Liquidity Pool",
    desc: "Aave-style DEX liquidity, protocol treasury reserves",
  },
  {
    pct: "20%",
    name: "Team & PCB",
    desc: "24-month vesting cliff, 2% per-tx revenue to PCB",
  },
  {
    pct: "15%",
    name: "Ecosystem",
    desc: "Developer grants, partnerships, hackathon prizes",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
};

export default function Tokenomics() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  return (
    <section
      id="tokenomics"
      className="relative z-2 border-t border-border-neon"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(0,255,136,0.02), transparent)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-15 py-20 md:py-30">
        <SectionHeader
          tag="$NEXUS Token"
          title="Token"
          accent="Distribution"
        />

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mt-15 border border-border-neon"
          style={{ background: "rgba(0,255,136,0.2)" }}
        >
          {tokens.map((token, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
              className="bg-dark-bg p-8 md:p-10 text-center transition-colors duration-300 hover:bg-[rgba(0,255,136,0.04)] cursor-none"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              <span
                className="font-orbitron text-[2.8rem] font-black bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent block"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(0,255,136,0.4))",
                }}
              >
                {token.pct}
              </span>
              <div className="font-orbitron text-[0.75rem] text-text-primary mt-3 mb-2 tracking-[0.1em]">
                {token.name}
              </div>
              <div className="font-share-tech text-[0.65rem] text-text-muted tracking-[0.1em] leading-relaxed">
                {token.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
