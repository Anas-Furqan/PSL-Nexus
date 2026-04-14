"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  tag: string;
  title: string;
  accent: string;
  centered?: boolean;
}

export default function SectionHeader({
  tag,
  title,
  accent,
  centered = false,
}: SectionHeaderProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7 }}
        className={`font-share-tech text-[0.65rem] tracking-[0.4em] text-neon-green uppercase mb-4 flex items-center gap-3 section-tag-line ${
          centered ? "justify-center" : ""
        }`}
      >
        {tag}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-orbitron font-bold text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] mb-5"
        dangerouslySetInnerHTML={{
          __html: `${title} <span class="text-neon-green" style="text-shadow: 0 0 10px rgba(0,255,136,0.4)">${accent}</span>`,
        }}
      />
    </>
  );
}
