"use client";

export default function Footer() {
  return (
    <footer className="relative z-2 border-t border-border-neon px-6 md:px-15 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div
        className="font-orbitron font-black text-[1rem] text-neon-green"
        style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
      >
        PSL NEXUS
      </div>
      <div className="font-share-tech text-[0.6rem] tracking-[0.2em] text-text-muted uppercase">
        © 2025 PSL Nexus · Built on Wirefluid · Hackathon Edition
      </div>
      <div className="font-share-tech text-[0.6rem] tracking-[0.2em] text-text-muted uppercase">
        Solidity ^0.8.20 · ERC-4337 · Three.js
      </div>
    </footer>
  );
}
