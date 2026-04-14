"use client";

import { motion } from "framer-motion";

const tickerItems: {
  label: string;
  value: string;
  direction: "up" | "down" | "neutral";
}[] = [
  { label: "$NEXUS", value: "+12.4%", direction: "up" },
  { label: "WIREFLUID MAINNET", value: "LIVE", direction: "up" },
  { label: "KHI KINGS", value: "+8.2%", direction: "up" },
  { label: "NEXUS LAND PLOTS", value: "1,024 / 10,000 MINTED", direction: "neutral" },
  { label: "PSL SEASON 10", value: "LIVE", direction: "up" },
  { label: "STAKING APY", value: "182%", direction: "up" },
  { label: "TOTAL VOLUME", value: "$4.7M", direction: "neutral" },
];

function TickerItem({
  item,
}: {
  item: (typeof tickerItems)[number];
}) {
  return (
    <span className="font-share-tech text-[0.7rem] tracking-[0.2em] text-text-muted uppercase flex items-center gap-3 shrink-0">
      {item.direction === "up" && (
        <span className="text-neon-green">▲</span>
      )}
      {item.direction === "down" && (
        <span className="text-error-red">▼</span>
      )}
      {item.label}
      &nbsp;&nbsp;
      <span className={item.direction === "up" ? "text-neon-green" : ""}>
        {item.value}
      </span>
    </span>
  );
}

export default function Ticker() {
  // Duplicate items for seamless loop
  const allItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative z-2 border-t border-b border-border-neon bg-dark-panel overflow-hidden py-3 mt-[72px]">
      <motion.div
        className="flex gap-15"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {allItems.map((item, i) => (
          <TickerItem key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
