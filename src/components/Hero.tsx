"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useCursorContext } from "./CustomCursor";

const stats = [
  { value: "Chain 92533", label: "WireFluid Testnet" },
  { value: "Live 3D Arena", label: "PSL Nexus Stadium Twin" },
  { value: "Land + Yield", label: "NexusEconomy x NexusLand" },
  { value: "Entangled 2026", label: "Dettol Warriors Build" },
];

export default function Hero({ onEnterMetaverse }: { onEnterMetaverse?: () => void }) {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center z-2 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating orbs that track mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -top-[100px] -left-[200px] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)",
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none -bottom-[50px] -right-[100px] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)",
          transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Hero content */}
      <div className="text-center max-w-[900px] px-10 relative">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block font-share-tech text-[0.7rem] tracking-[0.4em] text-neon-green uppercase border border-border-neon px-5 py-1.5 mb-8 relative overflow-hidden hero-tag-glow"
        >
          [ Wirefluid EVM — Hackathon Edition ]
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-orbitron font-black text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] mb-2"
        >
          <span className="block text-text-primary">THE CRICKET</span>
          <span
            className="glitch block bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent"
            data-text="METAVERSE"
            style={{
              filter: "drop-shadow(0 0 30px rgba(0,255,136,0.5))",
            }}
          >
            METAVERSE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[1.2rem] font-light text-text-muted tracking-[0.08em] mt-7 mb-12 leading-relaxed"
        >
          Own stadium land. Stake $NEXUS. Predict live matches.
          <br />
          Powered by Wirefluid&apos;s instant-finality blockchain.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button
            className="btn-clip-primary"
            onClick={() => onEnterMetaverse ? onEnterMetaverse() : document.getElementById('stadium')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            Enter Metaverse
          </button>
          <Link
            href="/dashboard"
            className="btn-clip-secondary inline-block"
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            Open Dashboard
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row mt-20 border border-border-neon overflow-hidden"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex-1 px-8 py-6 text-center border-b md:border-b-0 md:border-r border-border-neon last:border-r-0 last:border-b-0 relative transition-colors duration-300 hover:bg-[rgba(0,255,136,0.04)]"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              <span
                className="font-orbitron text-[2rem] font-bold text-neon-green block"
                style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
              >
                {stat.value}
              </span>
              <span className="font-share-tech text-[0.65rem] tracking-[0.2em] text-text-muted uppercase mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
