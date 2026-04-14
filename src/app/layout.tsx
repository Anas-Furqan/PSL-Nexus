import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-family-orbitron",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-family-share-tech",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-family-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PSL NEXUS — The Future of Cricket",
  description:
    "Own stadium land. Stake $NEXUS. Predict live matches. The cricket metaverse powered by Wirefluid's instant-finality blockchain.",
  keywords: [
    "PSL",
    "NEXUS",
    "cricket",
    "metaverse",
    "blockchain",
    "NFT",
    "Web3",
    "Wirefluid",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
