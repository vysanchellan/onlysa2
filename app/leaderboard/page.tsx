"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageBackLink } from "@/components/onlysa/page-back-link";
import {
  fetchLeaderboard,
  getTierDisplayColor,
  getWeekResetLabel,
  LEADERBOARD_AREAS,
  type LeaderboardArea,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { ThroneBanner } from "@/components/onlysa/throne-banner";
import { ChallengeModal } from "@/components/onlysa/challenge-modal";
import { CosignWall } from "@/components/onlysa/cosign-wall";
import { AppBottomNav } from "@/components/onlysa/app-bottom-nav";
import { getActiveBattles, getMockTopPosts } from "@/lib/arena";

function rankColor(rank: number): string {
  if (rank === 1) return "#F5A623";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "rgba(255,255,255,0.25)";
}

function LeaderboardRow({
  entry,
  onChallenge,
}: {
  entry: LeaderboardEntry;
  onChallenge: (identity: string) => void;
}) {
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className={`relative flex items-center gap-4 px-4 py-4 rounded-[16px] border mb-2 group/cursor-pointer ${
        entry.rank === 1
          ? "bg-[rgba(245,166,35,0.06)] border-[rgba(245,166,35,0.25)]"
          : entry.isCurrentUser
            ? "bg-[rgba(245,166,35,0.04)] border-[rgba(245,166,35,0.2)]"
            : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)]"
      } hover:border-[rgba(255,255,255,0.12)]`}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
        style={{ background: rankColor(entry.rank) }}
      />

      <div
        className={`text-[14px] font-black w-8 text-center flex-shrink-0 ${
          entry.rank === 1
            ? "text-[#F5A623]"
            : entry.rank === 2
              ? "text-[#C0C0C0]"
              : entry.rank === 3
                ? "text-[#CD7F32]"
                : "text-[rgba(255,255,255,0.25)]"
        }`}
      >
        #{entry.rank}
      </div>

      <div
        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-black ${
          entry.rank === 1
            ? "bg-gradient-to-br from-[#F5A623] to-[#E8890C] text-black"
            : entry.isCurrentUser
              ? "bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] text-black"
              : "bg-[rgba(255,255,255,0.07)] text-white"
        }`}
      >
        {entry.identity.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-[13px] font-bold truncate ${
            entry.isCurrentUser
              ? "text-[#F5A623]"
              : isTop3
                ? "text-white"
                : "text-[rgba(255,255,255,0.85)]"
          }`}
        >
          {entry.identity}
          {entry.isCurrentUser ? " (You)" : ""}
        </div>
        <div className="text-[11px] text-[rgba(255,255,255,0.3)] mt-0.5 flex items-center gap-2">
          <span style={{ color: getTierDisplayColor(entry.tier) }}>{entry.tier}</span>
          <span>&middot;</span>
          <span>{entry.postCount} posts this week</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div
            className={`text-[16px] font-black ${entry.rank === 1 ? "text-[#F5A623]" : "text-white"}`}
          >
            {entry.cloutScore.toLocaleString()}
          </div>
          <div className="text-[9px] text-[rgba(255,255,255,0.25)] uppercase tracking-widest">
            Clout
          </div>
        </div>

        {!entry.isCurrentUser && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover/cursor-pointer:opacity-100 px-3 py-1.5 rounded-full border border-[rgba(255,107,107,0.35)] text-[#FF6B6B] text-[9px] font-black tracking-[0.15em] uppercase hover:bg-[rgba(255,107,107,0.1)] transition-all duration-200 hidden sm:block"
            onClick={(e) => {
              e.stopPropagation();
              onChallenge(entry.identity);
            }}
          >
            Challenge
          </motion.button>
        )}
      </div>

      {!entry.isCurrentUser && (
        <button
          className="sm:hidden px-2 py-1 rounded-full border border-[rgba(255,107,107,0.35)] text-[#FF6B6B] text-[8px] font-black tracking-wider uppercase hover:bg-[rgba(255,107,107,0.1)] transition-all flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onChallenge(entry.identity);
          }}
        >
          Fight
        </button>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const [area, setArea] = useState<LeaderboardArea>("All SA");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [resetLabel, setResetLabel] = useState("");
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);
  const [activeBattles, setActiveBattles] = useState(getActiveBattles());

  useEffect(() => {
    setEntries(fetchLeaderboard(area));
    setResetLabel(getWeekResetLabel());
    const t = setInterval(() => {
      setResetLabel(getWeekResetLabel());
      setActiveBattles(getActiveBattles());
    }, 10_000);
    return () => clearInterval(t);
  }, [area]);

  const topPosts = useMemo(() => {
    return getMockTopPosts(entries.slice(0, 10));
  }, [entries]);

  return (
    <>
      <div className="leaderboard-page">
        <div className="leaderboard-page-inner">
          <PageBackLink />

          <header className="leaderboard-header">
            <h1 className="leaderboard-title">Clout Leaderboard</h1>
            <p className="leaderboard-subtitle">
              This week&apos;s most vocal South Africans
            </p>
            <p className="leaderboard-reset">{resetLabel}</p>
          </header>

          <ThroneBanner
            onThroneShot={() => {
              // In a real implementation this would trigger a throne shot post
              alert("Submit a post that beats the #1's best from the last 24h to take the Throne!");
            }}
          />

          <div className="composition-chips-scroll leaderboard-filters">
            {LEADERBOARD_AREAS.map((a) => (
              <motion.button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                whileTap={{ scale: 0.95 }}
                animate={area === a ? { scale: 1.04 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className={`composition-area-chip ${area === a ? "composition-area-chip--selected" : ""}`}
              >
                {a}
              </motion.button>
            ))}
          </div>

          {activeBattles.length > 0 && (
            <div className="mb-6">
              <div className="text-[11px] text-white/35 uppercase tracking-widest mb-3">
                Active Battles
              </div>
              {activeBattles.map((b) => (
                <div
                  key={b.id}
                  className="rounded-[16px] bg-[rgba(245,166,35,0.04)] border border-[rgba(245,166,35,0.15)] px-4 py-3 mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-white/80">
                      {b.challengerIdentity} vs {b.challengedIdentity}
                    </div>
                    <span className="text-[9px] font-mono text-[#F5A623]">
                      {b.status === "pending" ? "Awaiting response" : "Voting open"}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 line-clamp-1">
                    &ldquo;{b.topic}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="leaderboard-list">
            {entries.map((entry) => (
              <LeaderboardRow
                key={`${entry.rank}-${entry.identity}`}
                entry={entry}
                onChallenge={(identity) => setChallengeTarget(identity)}
              />
            ))}
          </div>

          <CosignWall topPosts={topPosts} />
        </div>
      </div>

      <ChallengeModal
        open={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        challengedIdentity={challengeTarget || ""}
      />

      <AppBottomNav />
    </>
  );
}
