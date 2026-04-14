"use client";

import { motion } from "framer-motion";
import { useCursorContext } from "./CustomCursor";

export default function CTA({ onEnterMetaverse }: { onEnterMetaverse?: () => void }) {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  return (
    <section
      id="cta"
      className="relative z-2 border-t border-border-neon"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,255,136,0.06) 0%, transparent 70%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-15 py-20 md:py-30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7 }}
          className="font-share-tech text-[0.65rem] tracking-[0.4em] text-neon-green uppercase mb-4 flex items-center gap-3 justify-center section-tag-line"
        >
          Ready to Build
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-orbitron font-black text-[clamp(2.5rem,5vw,5rem)] leading-none mb-6"
        >
          Win the{" "}
          <span
            className="text-neon-green"
            style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
          >
            Hackathon.
          </span>
          <br />
          Claim the Future.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[1.1rem] text-text-muted max-w-[500px] mx-auto mb-12 leading-[1.7]"
        >
          PSL NEXUS is live on Wirefluid testnet. Connect your wallet and step
          into the stadium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button
            className="btn-clip-primary"
            onClick={() => onEnterMetaverse ? onEnterMetaverse() : document.getElementById('stadium')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            Launch App
          </button>
          <button
            className="btn-clip-secondary"
            onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            Read Whitepaper
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="inline-flex items-center gap-3 mt-12 border border-border-neon px-8 py-4 font-share-tech text-[0.7rem] tracking-[0.2em] text-text-muted uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-neon-green animate-blink shadow-[0_0_10px_rgba(0,255,136,0.4)]" />
          Deployed on Wirefluid — EVM Equivalent · Instant Finality · Zero Gas
          for Users
        </motion.div>
      </div>
    </section>
  );
}
