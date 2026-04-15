"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import { formatEther, parseEther, type Abi, type Address } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { CONTRACT_ADDRESSES } from "@/constants/addresses";
import economyAbi from "@/constants/economyAbi.json";
import landAbi from "@/constants/landAbi.json";
import { useCursorContext } from "./CustomCursor";

const METADATA_URI = "https://psl-nexus.com/metadata/plot.json";
const TOKEN_SCAN_LIMIT = 1200;
const TOKEN_SCAN_BATCH = 120;
const WEI_DECIMALS = BigInt("1000000000000000000");

const StadiumMetaverse = dynamic(() => import("./StadiumMetaverse"), {
  ssr: false,
});

type ActionTab = "stake" | "withdraw" | "mint";

type ZoneCoord = {
  tokenId: number;
  x: number;
  y: number;
};

const mapTokenToZone = (tokenId: number): ZoneCoord => {
  const normalized = ((tokenId - 1) % 100) + 1;
  const x = (normalized - 1) % 10;
  const y = Math.floor((normalized - 1) / 10);
  return { tokenId, x, y };
};

function formatAmount(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

function formatLiveAmount(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
}

export default function Web3Console() {
  const { onCursorEnter, onCursorLeave } = useCursorContext();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [stakeAmount, setStakeAmount] = useState("110");
  const [withdrawAmount, setWithdrawAmount] = useState("10");
  const [isWorking, setIsWorking] = useState(false);
  const [activeTxLabel, setActiveTxLabel] = useState("");
  const [activeTab, setActiveTab] = useState<ActionTab>("stake");
  const [displayRewards, setDisplayRewards] = useState(0);
  const [projectedRewardsWei, setProjectedRewardsWei] = useState(BigInt(0));
  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([]);
  const [isScanningPlots, setIsScanningPlots] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const rewardsTweenRef = useRef({ val: 0 });

  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
      refetchInterval: 6000,
    },
  });

  const {
    data: stakeData,
    refetch: refetchStakeData,
    isFetching: fetchingStake,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.ECONOMY,
    abi: economyAbi as Abi,
    functionName: "userStakes",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 2000,
    },
  });

  const { data: rewardRateWei } = useReadContract({
    address: CONTRACT_ADDRESSES.ECONOMY,
    abi: economyAbi as Abi,
    functionName: "REWARD_RATE",
    query: {
      refetchInterval: 10000,
    },
  });

  const { data: nexusBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.ECONOMY,
    abi: economyAbi as Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  const { data: nftBalance, refetch: refetchNftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LAND,
    abi: landAbi as Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  const { data: linkedLandAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.ECONOMY,
    abi: economyAbi as Abi,
    functionName: "nexusLandAddress",
  });

  const stakedWei =
    ((stakeData as readonly [bigint, bigint, bigint] | undefined)?.[0] ??
      BigInt(0)) as bigint;
  const lastUpdateWei =
    ((stakeData as readonly [bigint, bigint, bigint] | undefined)?.[1] ??
      BigInt(0)) as bigint;
  const rewardsWei =
    ((stakeData as readonly [bigint, bigint, bigint] | undefined)?.[2] ??
      BigInt(0)) as bigint;
  const ownedPlots = Number(nftBalance ?? BigInt(0));
  const isPremiumMember = useMemo(() => {
    return typeof nftBalance === "bigint" && nftBalance > BigInt(0);
  }, [nftBalance]);

  useEffect(() => {
    if (!cardsRef.current) return;

    const items = cardsRef.current.querySelectorAll(".dash-enter");
    gsap.fromTo(
      items,
      { opacity: 0, y: 18, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, []);

  useEffect(() => {
    if (!isConnected || !address) {
      setProjectedRewardsWei(BigInt(0));
      return;
    }

    const rewardRate = (rewardRateWei as bigint | undefined) ?? BigInt(0);
    const stakeAmountWei = stakedWei;
    const baseRewardsWei = rewardsWei;

    const project = () => {
      if (stakeAmountWei <= BigInt(0) || rewardRate <= BigInt(0)) {
        setProjectedRewardsWei(baseRewardsWei);
        return;
      }

      const nowSec = BigInt(Math.floor(Date.now() / 1000));
      const elapsed = nowSec > lastUpdateWei ? nowSec - lastUpdateWei : BigInt(0);

      let accruedWei = (stakeAmountWei * rewardRate * elapsed) / WEI_DECIMALS;

      // Premium badge indicates boosted yield; reflect this in projected live earnings.
      if (ownedPlots > 0) {
        accruedWei = (accruedWei * BigInt(15)) / BigInt(10);
      }

      setProjectedRewardsWei(baseRewardsWei + accruedWei);
    };

    project();
    const projectionTimer = setInterval(project, 100);

    return () => {
      clearInterval(projectionTimer);
    };
  }, [
    address,
    isConnected,
    ownedPlots,
    rewardRateWei,
    rewardsWei,
    lastUpdateWei,
    stakedWei,
  ]);

  useEffect(() => {
    const rewardsNumber = Number(formatEther(projectedRewardsWei));

    gsap.to(rewardsTweenRef.current, {
      val: rewardsNumber,
      duration: 0.55,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        setDisplayRewards(rewardsTweenRef.current.val);
      },
    });

    return () => {
      gsap.killTweensOf(rewardsTweenRef.current);
    };
  }, [projectedRewardsWei]);

  useEffect(() => {
    let cancelled = false;

    const scanOwnedTokenIds = async () => {
      if (!publicClient || !address || !isConnected || !isPremiumMember) {
        setOwnedTokenIds([]);
        return;
      }

      const targetOwned = Number(nftBalance ?? BigInt(0));
      if (targetOwned <= 0) {
        setOwnedTokenIds([]);
        return;
      }

      setIsScanningPlots(true);
      const found: number[] = [];
      let canUseMulticall = true;

      for (let startId = 1; startId <= TOKEN_SCAN_LIMIT; startId += TOKEN_SCAN_BATCH) {
        if (cancelled || found.length >= targetOwned) break;

        const endId = Math.min(startId + TOKEN_SCAN_BATCH - 1, TOKEN_SCAN_LIMIT);
        if (canUseMulticall) {
          const calls = [];

          for (let tokenId = startId; tokenId <= endId; tokenId += 1) {
            calls.push({
              address: CONTRACT_ADDRESSES.LAND,
              abi: landAbi as Abi,
              functionName: "ownerOf",
              args: [BigInt(tokenId)],
            });
          }

          try {
            const results = await publicClient.multicall({
              contracts: calls,
              allowFailure: true,
            });

            results.forEach((result, index) => {
              if (result.status !== "success") return;
              const owner = (result.result as Address).toLowerCase();
              if (owner === address.toLowerCase()) {
                found.push(startId + index);
              }
            });
            continue;
          } catch {
            // WireFluid does not expose multicall3; fall back to direct reads.
            canUseMulticall = false;
          }
        }

        for (let tokenId = startId; tokenId <= endId; tokenId += 1) {
          if (cancelled || found.length >= targetOwned) break;

          try {
            const owner = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.LAND,
              abi: landAbi as Abi,
              functionName: "ownerOf",
              args: [BigInt(tokenId)],
            });

            if ((owner as Address).toLowerCase() === address.toLowerCase()) {
              found.push(tokenId);
            }
          } catch {
            // ownerOf reverts for non-minted token IDs; ignore.
          }
        }
      }

      if (!cancelled) {
        setOwnedTokenIds(found.slice(0, targetOwned));
        setIsScanningPlots(false);
      }
    };

    void scanOwnedTokenIds();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, isPremiumMember, nftBalance, publicClient]);

  useEffect(() => {
    if (!loaderRef.current) return;

    if (isWorking) {
      gsap.to(loaderRef.current, {
        rotate: 360,
        repeat: -1,
        duration: 1,
        ease: "none",
      });
      return;
    }

    gsap.killTweensOf(loaderRef.current);
    gsap.set(loaderRef.current, { rotate: 0 });
  }, [isWorking]);

  const runTx = async (label: string, callback: () => Promise<void>) => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first.");
      return;
    }

    setIsWorking(true);
    setActiveTxLabel(label);
    const toastId = toast.loading("Transaction Pending");

    try {
      await callback();
      await Promise.all([refetchStakeData(), refetchNftBalance()]);
      toast.success("Transaction Successful", { id: toastId });
    } catch {
      toast.error("Transaction Failed", { id: toastId });
    } finally {
      setIsWorking(false);
      setActiveTxLabel("");
    }
  };

  const onStake = async () => {
    const parsedAmount = parseEther(stakeAmount || "0");
    if (parsedAmount <= BigInt(0)) {
      toast.error("Enter a valid stake amount.");
      return;
    }

    await runTx("Approving + Staking", async () => {
      const approveHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ECONOMY,
        abi: economyAbi as Abi,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.ECONOMY, parsedAmount],
      });

      await publicClient?.waitForTransactionReceipt({ hash: approveHash });

      const stakeHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ECONOMY,
        abi: economyAbi as Abi,
        functionName: "stake",
        args: [parsedAmount],
      });

      await publicClient?.waitForTransactionReceipt({ hash: stakeHash });
    });
  };

  const onWithdraw = async () => {
    const parsedAmount = parseEther(withdrawAmount || "0");
    if (parsedAmount <= BigInt(0)) {
      toast.error("Enter a valid withdraw amount.");
      return;
    }

    await runTx("Withdrawing", async () => {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ECONOMY,
        abi: economyAbi as Abi,
        functionName: "withdraw",
        args: [parsedAmount],
      });

      await publicClient?.waitForTransactionReceipt({ hash });
    });
  };

  const onMintPlot = async () => {
    if (!address) {
      toast.error("Connect your wallet first.");
      return;
    }

    await runTx("Minting Stadium Plot", async () => {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.LAND,
        abi: landAbi as Abi,
        functionName: "safeMint",
        args: [address as `0x${string}`, METADATA_URI],
      });

      await publicClient?.waitForTransactionReceipt({ hash });
    });
  };

  const contractsLinked =
    typeof linkedLandAddress === "string" &&
    linkedLandAddress.toLowerCase() === CONTRACT_ADDRESSES.LAND.toLowerCase();

  const stakingAmountLabel = isConnected
    ? `${formatAmount(Number(formatEther(stakedWei)))} NEXUS`
    : "110.00 NEXUS";
  const nativeBalanceLabel = isConnected && nativeBalance
    ? `${formatAmount(Number(formatEther(nativeBalance.value)))} WIRE`
    : "0.00 WIRE";
  const nexusBalanceLabel = isConnected
    ? `${formatAmount(Number(formatEther((nexusBalance as bigint | undefined) ?? BigInt(0))))} NEXUS`
    : "0.00 NEXUS";
  const currentMultiplier = ownedPlots > 0 ? "1.5x Boost" : "1.0x Base";
  const zoneTokenIds =
    ownedTokenIds.length > 0
      ? ownedTokenIds.slice(0, Math.min(ownedPlots, 12))
      : Array.from({ length: Math.min(ownedPlots, 12) }, (_, i) => i + 1);
  const ownedZoneCoords = zoneTokenIds.map(mapTokenToZone);

  return (
    <section id="web3" className="relative z-2 border-t border-border-neon">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pb-18 md:pb-22" ref={cardsRef}>
        <div className="dashboard-shell dash-enter">
          <div className="dashboard-topbar">
            <div>
              <div className="font-share-tech text-[0.62rem] tracking-[0.34em] text-neon-green uppercase mb-3">
                Nexus User Dashboard
              </div>
              <h2 className="font-orbitron font-bold text-[clamp(1.6rem,3.5vw,2.7rem)] leading-[1.1]">
                Your WireFluid Command Center
              </h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {ownedPlots > 0 && (
                <div className="premium-badge-glow">Premium Member</div>
              )}
              <div className="wallet-btn-shell" onMouseEnter={onCursorEnter} onMouseLeave={onCursorLeave}>
                <ConnectButton showBalance={false} chainStatus="icon" />
              </div>
            </div>
          </div>

          <div className="dashboard-stats-grid mt-8 dash-enter">
            <div className="glass-card stat-card">
              <div className="stat-title">Wallet Balance</div>
              <div className="stat-value">{nativeBalanceLabel}</div>
              <div className="stat-meta">{nexusBalanceLabel}</div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-title">Total Staked</div>
              <div className="stat-value">{stakingAmountLabel}</div>
              <div className="stat-meta">NexusEconomy Pool</div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-title">Current Multiplier</div>
              <div className="stat-value text-neon-cyan">{currentMultiplier}</div>
              <div className="stat-meta">
                {ownedPlots > 0 ? "Plot ownership verified" : "Mint a plot to boost yield"}
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-title">Live Earning</div>
              <div className="stat-value">{formatLiveAmount(displayRewards)} NEXUS</div>
              <div className="stat-meta">GSAP Live Ticker</div>
            </div>
          </div>

          <div className="dashboard-content-grid mt-7 dash-enter">
            <div className="glass-card stadium-card">
              <div className="web3-card-title mb-5">Stadium Ownership Map</div>
              <div className="stadium-visual-wrap">
                <StadiumMetaverse embedded />
                {ownedPlots > 0 && <div className="stadium-ownership-grid" />}
                {ownedPlots > 0 && (
                  <div className="stadium-zone-map">
                    {ownedZoneCoords.map((zone) => (
                      <span
                        key={`${zone.tokenId}-${zone.x}-${zone.y}`}
                        className="owned-zone-dot"
                        style={{
                          left: `calc(${(zone.x + 0.5) * 10}% - 7px)`,
                          top: `calc(${(zone.y + 0.5) * 10}% - 7px)`,
                        }}
                        title={`Plot #${zone.tokenId} (${zone.x}, ${zone.y})`}
                      />
                    ))}
                  </div>
                )}
                {ownedPlots > 0 && (
                  <div className="stadium-owned-zones">
                    {zoneTokenIds.slice(0, 8).map((tokenId) => (
                      <span key={tokenId} className="owned-zone-chip">
                        #{tokenId}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {isScanningPlots ? (
                  <span className="web3-note">Scanning owned plots...</span>
                ) : ownedTokenIds.length > 0 ? (
                  ownedTokenIds.map((tokenId) => (
                    <span key={tokenId} className="plot-pill">
                      Plot #{tokenId}
                    </span>
                  ))
                ) : (
                  <span className="web3-note">No plots yet. Mint your first stadium zone.</span>
                )}
              </div>

              <div className="web3-status-inline mt-5">
                <span>Owned Plots: {ownedPlots}</span>
                <span className={contractsLinked ? "text-neon-green" : "text-error-red"}>
                  Economy to Land: {contractsLinked ? "Linked" : "Not Linked"}
                </span>
              </div>
            </div>

            <aside className="glass-card action-center-card">
              <div className="web3-card-title mb-4">Action Center</div>

              <div className="action-tab-row mb-4">
                <button
                  className={`action-tab ${activeTab === "stake" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("stake")}
                >
                  Stake
                </button>
                <button
                  className={`action-tab ${activeTab === "withdraw" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("withdraw")}
                >
                  Withdraw
                </button>
                <button
                  className={`action-tab ${activeTab === "mint" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("mint")}
                >
                  Mint Plot
                </button>
              </div>

              {activeTab !== "mint" ? (
                <>
                  <label className="web3-label">Amount (18 decimals)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.000001"
                    className="web3-input"
                    value={activeTab === "stake" ? stakeAmount : withdrawAmount}
                    onChange={(e) => {
                      if (activeTab === "stake") {
                        setStakeAmount(e.target.value);
                      } else {
                        setWithdrawAmount(e.target.value);
                      }
                    }}
                  />
                </>
              ) : (
                <div className="web3-note mb-4">Mint URI: {METADATA_URI}</div>
              )}

              {activeTab === "stake" && (
                <button
                  className="btn-clip-primary w-full mt-3"
                  onClick={onStake}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                  disabled={isWorking}
                >
                  Approve + Stake
                </button>
              )}

              {activeTab === "withdraw" && (
                <button
                  className="btn-clip-secondary w-full mt-3"
                  onClick={onWithdraw}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                  disabled={isWorking}
                >
                  Withdraw NEXUS
                </button>
              )}

              {activeTab === "mint" && (
                <button
                  className="btn-clip-primary w-full mt-3"
                  onClick={onMintPlot}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                  disabled={isWorking}
                >
                  Mint Stadium Plot
                </button>
              )}

              <div className="mt-6 web3-status-bar">
                <div className="flex items-center gap-3">
                  <div
                    ref={loaderRef}
                    className={`web3-loader ${isWorking ? "is-running" : ""}`}
                  />
                  <span className="font-share-tech text-[0.7rem] tracking-[0.16em] uppercase text-text-muted">
                    {isWorking
                      ? `${activeTxLabel} - Transaction Pending`
                      : fetchingStake
                        ? "Refreshing On-Chain State"
                        : "Ready"}
                  </span>
                </div>
                <strong className="font-share-tech text-[0.68rem] tracking-[0.12em] text-neon-cyan uppercase">
                  Chain 92533
                </strong>
              </div>
            </aside>
          </div>

          <div className="dashboard-footer-note mt-6 dash-enter">
            <span className="font-share-tech text-[0.68rem] tracking-[0.2em] text-text-muted uppercase">
              Premium Yield: {ownedPlots > 0 ? "0.75% Activated" : "Inactive"}
            </span>
            <strong className={contractsLinked ? "text-neon-green" : "text-error-red"}>
              {contractsLinked ? "Contracts Synchronized" : "Run setNexusLandAddress"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
