"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { useCursorContext } from "./CustomCursor";

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const { onCursorEnter, onCursorLeave } = useCursorContext();

  const navLinks =
    pathname === "/"
      ? [
          { href: "/", label: "Landing", route: true },
          { href: "#stadium-preview", label: "Stadium", route: false },
          { href: "/dashboard", label: "Dashboard", route: true },
        ]
      : [
          { href: "/", label: "Landing", route: true },
          { href: "/dashboard", label: "Dashboard", route: true },
        ];

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
        href="/"
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
                link.route
                  ? pathname === link.href
                    ? "text-neon-green"
                    : "text-text-muted hover:text-neon-green"
                  : activeSection === link.href.slice(1)
                  ? "text-neon-green"
                  : "text-text-muted hover:text-neon-green"
              }`}
              style={
                (link.route && pathname === link.href) ||
                (!link.route && activeSection === link.href.slice(1))
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
        <div className="wallet-btn-shell">
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </nav>
  );
}
