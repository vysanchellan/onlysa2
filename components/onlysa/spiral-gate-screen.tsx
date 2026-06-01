"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GatePreviewStack } from "./gate-preview-stack";
import { Post } from "@/types";
import { getActiveBattles, type Battle } from "@/lib/arena";

const DottedSurface = dynamic(
  () =>
    import("@/components/ui/dotted-surface").then((m) => ({
      default: m.DottedSurface,
    })),
  { ssr: false }
);

function formatTimeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function LiveBattlePreview({ battle, onEnter }: { battle: Battle; onEnter: () => void }) {
  const total = battle.leftVotes + battle.rightVotes;
  const leftPercent = total > 0 ? Math.round((battle.leftVotes / total) * 100) : 50;
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(battle.expiresAt));

  useEffect(() => {
    const t = setInterval(() => setTimeRemaining(formatTimeRemaining(battle.expiresAt)), 30000);
    return () => clearInterval(t);
  }, [battle.expiresAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[340px] rounded-[18px] border border-[rgba(245,166,35,0.18)] bg-[rgba(245,166,35,0.04)] backdrop-blur-xl overflow-hidden cursor-pointer"
      onClick={onEnter}
      whileHover={{ borderColor: "rgba(245,166,35,0.35)" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(245,166,35,0.1)] bg-[rgba(245,166,35,0.06)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A623]" />
          </span>
          <span className="text-[10px] font-[800] tracking-[0.2em] text-[#F5A623] uppercase">
            Live Battle
          </span>
        </div>
        <span className="text-[10px] text-[rgba(255,255,255,0.3)] tracking-wide">
          {timeRemaining} remaining
        </span>
      </div>

      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
        <div className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-1">
          Topic
        </div>
        <div className="text-[13px] font-[700] text-white leading-snug">
          {battle.topic}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 px-3 py-3 border-r border-[rgba(255,255,255,0.05)]">
          <div className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-1 truncate">
            {battle.challengerIdentity}
          </div>
          <div className="text-[12px] text-[rgba(255,255,255,0.8)] font-[500] leading-[1.5] line-clamp-2">
            {battle.challengerTake}
          </div>
        </div>
        <div className="flex-1 px-3 py-3">
          <div className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-1 truncate">
            {battle.challengedIdentity}
          </div>
          <div className="text-[12px] text-[rgba(255,255,255,0.8)] font-[500] leading-[1.5] line-clamp-2">
            {battle.challengedTake || "Awaiting response..."}
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8890C]"
            animate={{ width: `${leftPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 2.5 }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-[rgba(255,255,255,0.35)]">
            {leftPercent}% agree
          </span>
          <span className="text-[10px] text-[#F5A623] font-[600] tracking-wide">
            Enter to vote
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function BattleTeaser() {
  return (
    <div className="w-full max-w-[340px] rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-4 text-center">
      <div className="text-[11px] text-[rgba(255,255,255,0.25)] tracking-widest uppercase">
        Take Battles · Co-sign Wall · The Throne
      </div>
      <div className="text-[13px] text-[rgba(255,255,255,0.5)] mt-1 font-[500]">
        SA&apos;s most competitive anonymous arena
      </div>
    </div>
  );
}

interface SpiralGateScreenProps {
  onEnter: () => void;
  posts: Post[];
}

export function SpiralGateScreen({ onEnter, posts }: SpiralGateScreenProps) {
  const [battle, setBattle] = useState<Battle | null>(null);

  const previewPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    if (sorted.length >= 3) return sorted.slice(0, 3);
    return sorted;
  }, [posts]);

  useEffect(() => {
    const active = getActiveBattles();
    setBattle(active.length > 0 ? active[0] : null);
    const t = setInterval(() => {
      const a = getActiveBattles();
      setBattle(a.length > 0 ? a[0] : null);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="spiral-gate-screen">
      <DottedSurface fillContainer theme="dark" className="spiral-gate-dots" />

      <div className="spiral-gate-ambient" aria-hidden />
      <div className="spiral-gate-vignette" aria-hidden />

      <div className="spiral-gate-grid">
        <div className="spiral-gate-body">
          <motion.aside
            className="spiral-gate-stack-col max-md:hidden"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.85 }}
          >
            <GatePreviewStack posts={previewPosts} />
          </motion.aside>

          <div className="spiral-gate-enter-col">
            <motion.header
              className="spiral-gate-header-inline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="spiral-gate-logo">ONLYSA</h1>
              <p className="spiral-gate-tagline">
                The anonymous voice of South Africa
              </p>
            </motion.header>

            <motion.div
              className="spiral-gate-separator"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="md:hidden w-full flex justify-center">
              <GatePreviewStack posts={previewPosts} />
            </div>

            {battle ? (
              <LiveBattlePreview battle={battle} onEnter={onEnter} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <BattleTeaser />
              </motion.div>
            )}

            <motion.div
              className="spiral-gate-enter-block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.8 }}
            >
              <motion.button
                type="button"
                onClick={onEnter}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 60px rgba(245,166,35,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="ngena-btn"
              >
                NGENA
              </motion.button>
              <p className="ngena-whisper">
                ngena — enter · come in · isiZulu
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
