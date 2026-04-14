"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { useCursorContext } from "./CustomCursor";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#architecture", label: "Architecture" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#roadmap", label: "Roadmap" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const el = section as HTMLElement;
        if (window.scrollY >= el.offsetTop - 200) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-6 md:px-15 py-5 border-b border-border-neon bg-[rgba(3,10,6,0.8)] backdrop-blur-[20px]">
      {/* Logo */}
      <Link
        href="#"
        className="font-orbitron font-black text-[1.4rem] tracking-[0.15em] text-neon-green no-underline cursor-none"
        style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
      >
        PSL <span className="text-neon-cyan">NEXUS</span>
      </Link>

      {/* Nav Links - hidden on mobile */}
      <ul className="hidden md:flex gap-10 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`font-share-tech text-[0.75rem] tracking-[0.2em] uppercase no-underline transition-all duration-300 cursor-none ${
                activeSection === link.href.slice(1)
                  ? "text-neon-green"
                  : "text-text-muted hover:text-neon-green"
              }`}
              style={
                activeSection === link.href.slice(1)
                  ? { textShadow: "0 0 10px rgba(0,255,136,0.4)" }
                  : {}
              }
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Connect Wallet */}
      <div
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
        className="cursor-none"
      >
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="font-share-tech text-[0.75rem] tracking-[0.2em] text-dark-bg bg-neon-green border-none px-6 py-2.5 uppercase nav-cta-clip font-bold transition-all duration-300 cursor-none hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(0,255,136,0.3),0_0_60px_rgba(0,255,136,0.1)]"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="font-share-tech text-[0.75rem] tracking-[0.2em] text-dark-bg bg-error-red border-none px-6 py-2.5 uppercase nav-cta-clip font-bold cursor-none"
                      >
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="font-share-tech text-[0.75rem] tracking-[0.2em] text-dark-bg bg-neon-green border-none px-6 py-2.5 uppercase nav-cta-clip font-bold transition-all duration-300 cursor-none hover:bg-neon-cyan"
                    >
                      {account.displayName}
                    </button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
