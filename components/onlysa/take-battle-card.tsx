"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Swords } from "lucide-react";
import { type Battle, voteBattle, hasUserVoted, canUserRespond, respondToBattle } from "@/lib/arena";

interface TakeBattleCardProps {
  battle: Battle;
}

function timeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export function TakeBattleCard({ battle }: TakeBattleCardProps) {
  const [voted, setVoted] = useState(false);
  const [userVote, setUserVote] = useState<"left" | "right" | null>(null);
  const [respondText, setRespondText] = useState("");
  const [responding, setResponding] = useState(false);
  const [localBattle, setLocalBattle] = useState(battle);

  const total = localBattle.leftVotes + localBattle.rightVotes;
  const leftPercent = total > 0 ? Math.round((localBattle.leftVotes / total) * 100) : 50;
  const canVote = localBattle.status === "active" && !hasUserVoted(localBattle);
  const canRespond = canUserRespond(localBattle);

  useEffect(() => {
    setVoted(hasUserVoted(localBattle));
  }, [localBattle]);

  const handleVote = (side: "left" | "right") => {
    if (!canVote) return;
    const updated = voteBattle(localBattle.id, side);
    if (updated) {
      setLocalBattle(updated);
      setUserVote(side);
      setVoted(true);
    }
  };

  const handleRespond = async () => {
    if (!respondText.trim()) return;
    setResponding(true);
    const updated = respondToBattle(localBattle.id, respondText.trim());
    if (updated) {
      setLocalBattle(updated);
      setRespondText("");
    }
    setResponding(false);
  };

  return (
    <div className="rounded-[20px] bg-white/[0.03] border border-[rgba(245,166,35,0.2)] shadow-[0_0_40px_rgba(245,166,35,0.06)] overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(245,166,35,0.08)]">
        <div className="flex items-center gap-2">
          <Swords size={12} className="text-[#F5A623]" />
          <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#F5A623]">Take Battle</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
          <Clock size={10} />
          {timeRemaining(localBattle.expiresAt)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
          <div className="text-[10px] font-black tracking-[0.15em] uppercase text-white/40 mb-2">
            {localBattle.challengerIdentity}
          </div>
          <p className="text-[14px] font-medium text-white leading-relaxed">
            {localBattle.challengerTake}
          </p>
        </div>

        <div className="flex-1 p-4">
          {localBattle.challengedTake ? (
            <>
              <div className="text-[10px] font-black tracking-[0.15em] uppercase text-white/40 mb-2">
                {localBattle.challengedIdentity}
              </div>
              <p className="text-[14px] font-medium text-white leading-relaxed">
                {localBattle.challengedTake}
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-3 h-full justify-center">
              <p className="text-[12px] text-white/40 italic">
                Waiting for {localBattle.challengedIdentity} to respond...
              </p>
              {canRespond && (
                <div className="space-y-2">
                  <textarea
                    value={respondText}
                    onChange={(e) => setRespondText(e.target.value.slice(0, 280))}
                    placeholder="Your counter-take..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F5A623]/40 resize-none"
                  />
                  <button
                    onClick={handleRespond}
                    disabled={!respondText.trim() || responding}
                    className="w-full py-2 rounded-xl bg-[#F5A623] text-black text-[10px] font-black tracking-widest uppercase disabled:opacity-30 hover:opacity-90 transition-all"
                  >
                    {responding ? "Sending..." : "Respond"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {localBattle.status === "active" && localBattle.challengedTake && (
        <div className="px-4 pb-4">
          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-1">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8890C]"
              initial={{ width: "50%" }}
              animate={{ width: `${leftPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-[10px] text-white/40 font-mono">{leftPercent}%</span>
            <span className="text-[10px] text-white/40 font-mono">{100 - leftPercent}%</span>
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={() => handleVote("left")}
              disabled={!canVote}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2.5 rounded-[12px] text-[11px] font-black tracking-widest uppercase transition-all duration-200 ${
                userVote === "left"
                  ? "bg-[#F5A623] text-black"
                  : voted
                    ? "bg-white/5 text-white/20"
                    : "bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#F5A623] hover:bg-[rgba(245,166,35,0.15)]"
              }`}
            >
              Vote {localBattle.challengerIdentity}
            </motion.button>
            <motion.button
              onClick={() => handleVote("right")}
              disabled={!canVote}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2.5 rounded-[12px] text-[11px] font-black tracking-widest uppercase transition-all duration-200 ${
                userVote === "right"
                  ? "bg-[#F5A623] text-black"
                  : voted
                    ? "bg-white/5 text-white/20"
                    : "bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#F5A623] hover:bg-[rgba(245,166,35,0.15)]"
              }`}
            >
              Vote {localBattle.challengedIdentity}
            </motion.button>
          </div>

          {voted && (
            <div className="text-center text-[10px] text-white/30 mt-2 font-mono">
              Vote recorded
            </div>
          )}
        </div>
      )}

      {localBattle.status === "closed" && localBattle.winnerId && (
        <div className="px-4 pb-4">
          <div className="text-center py-2 rounded-xl bg-white/5 text-[11px] font-semibold text-[#34D399]">
            Winner: {localBattle.winnerId === localBattle.challengerSession
              ? localBattle.challengerIdentity
              : localBattle.challengedIdentity}
          </div>
        </div>
      )}

      <div className="px-4 pb-3 text-center text-[9px] text-white/20 font-mono">
        Topic: {localBattle.topic}
      </div>
    </div>
  );
}
