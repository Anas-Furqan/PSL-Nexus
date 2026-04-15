"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import LandingStadiumPreview from "@/components/LandingStadiumPreview";

import { useState } from "react";

// Dynamic import for 3D component to avoid SSR issues with Three.js
const StadiumMetaverse = dynamic(
  () => import("@/components/StadiumMetaverse"),
  { ssr: false }
);

export default function Home() {
  const [showMetaverse, setShowMetaverse] = useState(false);

  return (
    <main className="relative z-2 pt-24">
      <Hero onEnterMetaverse={() => setShowMetaverse(true)} />
      <LandingStadiumPreview />

      {showMetaverse && <StadiumMetaverse onClose={() => setShowMetaverse(false)} />}
    </main>
  );
}
