"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageBackLink } from "@/components/onlysa/page-back-link";
import {
  fetchLeaderboard,
  getRankBorderColor,
  getWeekResetLabel,
  LEADERBOARD_AREAS,
  type LeaderboardArea,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { AppBottomNav } from "@/components/onlysa/app-bottom-nav";

const spring = { type: "spring" as const, stiffness: 500, damping: 25 };

function rankColor(rank: number): string {
  if (rank === 1) return "#60A5FA";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#93C5FD";
  return "rgba(255,255,255,0.3)";
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const border = getRankBorderColor(entry.rank);
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className={`leaderboard-row ${entry.isCurrentUser ? "leaderboard-row--you" : ""} ${isTop3 ? "leaderboard-row--top" : ""}`}
      style={border ? { borderLeftColor: border } : undefined}
    >
      <div className="leaderboard-rank" style={{ color: rankColor(entry.rank) }}>
        #{entry.rank}
      </div>
      <div
        className={`leaderboard-avatar ${entry.isCurrentUser ? "leaderboard-avatar--you" : ""}`}
      >
        {entry.identity.charAt(0).toUpperCase()}
      </div>
      <div className="leaderboard-info">
        <div
          className={`leaderboard-name ${entry.isCurrentUser ? "leaderboard-name--you" : ""}`}
        >
          {entry.isCurrentUser ? `YOU (${entry.identity})` : entry.identity}
        </div>
        <div className="leaderboard-meta">
          {entry.tier} · {entry.postCount} posts this week
        </div>
      </div>
      <div className="leaderboard-score-block">
        <div
          className={`leaderboard-score ${entry.isCurrentUser ? "leaderboard-score--you" : ""}`}
        >
          {entry.cloutScore.toLocaleString()}
        </div>
        <div className="leaderboard-score-label">clout</div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [area, setArea] = useState<LeaderboardArea>("All SA");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [resetLabel, setResetLabel] = useState("");

  useEffect(() => {
    setEntries(fetchLeaderboard(area));
    setResetLabel(getWeekResetLabel());
    const t = setInterval(() => setResetLabel(getWeekResetLabel()), 60_000);
    return () => clearInterval(t);
  }, [area]);

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

          <div className="composition-chips-scroll leaderboard-filters">
            {LEADERBOARD_AREAS.map((a) => (
              <motion.button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                whileTap={{ scale: 0.95 }}
                animate={area === a ? { scale: 1.04 } : { scale: 1 }}
                transition={spring}
                className={`composition-area-chip ${area === a ? "composition-area-chip--selected" : ""}`}
              >
                {a}
              </motion.button>
            ))}
          </div>

          <div className="leaderboard-list">
            {entries.map((entry) => (
              <LeaderboardRow key={`${entry.rank}-${entry.identity}`} entry={entry} />
            ))}
          </div>
        </div>
      </div>
      <AppBottomNav />
    </>
  );
}
