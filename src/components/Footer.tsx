"use client";

import Link from "next/link";
import { CONTRACT_ADDRESSES } from "@/constants/addresses";
import { useCursorContext } from "./CustomCursor";

export default function Footer() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  return (
    <footer className="relative z-2 border-t border-border-neon mt-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-10 md:py-12">
        <div className="competition-footer-shell">
          <div>
            <div className="font-share-tech text-[0.62rem] tracking-[0.3em] text-neon-cyan uppercase mb-3">
              WireFluid Entangled 2026
            </div>
            <div
              className="font-orbitron font-black text-[1.2rem] text-neon-green"
              style={{ textShadow: "0 0 12px rgba(0,255,136,0.35)" }}
            >
              Dettol Warriors
            </div>
            <div className="font-share-tech text-[0.65rem] tracking-[0.14em] text-text-muted uppercase mt-4 leading-relaxed">
              Team Members: Anas Furqan, Anas Sheikh, Ali Adeel, Hammad Sheikh
            </div>
          </div>

          <div className="competition-footer-links">
            <Link
              href="https://github.com/dettol-warriors/psl-nexus"
              target="_blank"
              rel="noreferrer"
              className="footer-link-pill"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              Github Repo
            </Link>
            <Link
              href={`https://wirefluidscan.com/address/${CONTRACT_ADDRESSES.ECONOMY}`}
              target="_blank"
              rel="noreferrer"
              className="footer-link-pill"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              WireFluid Scan - Economy
            </Link>
            <Link
              href={`https://wirefluidscan.com/address/${CONTRACT_ADDRESSES.LAND}`}
              target="_blank"
              rel="noreferrer"
              className="footer-link-pill"
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              WireFluid Scan - Land
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
