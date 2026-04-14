"use client";

import dynamic from "next/dynamic";
import { CursorProvider } from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Architecture from "@/components/Architecture";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Web3Provider from "@/providers/Web3Provider";

import { useState } from "react";

// Dynamic import for 3D component to avoid SSR issues with Three.js
const StadiumMetaverse = dynamic(
  () => import("@/components/StadiumMetaverse"),
  { ssr: false }
);

export default function Home() {
  const [showMetaverse, setShowMetaverse] = useState(false);

  return (
    <Web3Provider>
      <CursorProvider>
        <Navbar />
        <Ticker />
        <Hero onEnterMetaverse={() => setShowMetaverse(true)} />
        <Features />
        <Architecture />
        <Tokenomics />
        <Roadmap />
        <CTA onEnterMetaverse={() => setShowMetaverse(true)} />
        <Footer />

        {showMetaverse && (
          <StadiumMetaverse onClose={() => setShowMetaverse(false)} />
        )}
      </CursorProvider>
    </Web3Provider>
  );
}
