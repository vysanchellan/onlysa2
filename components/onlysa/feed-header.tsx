"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Flame } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { FEED_AREAS } from "@/lib/constants";
import { getStreak } from "@/lib/engagement";

interface FeedHeaderProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
  liveCount: number;
  liveArea: string;
  onOpenJourney?: () => void;
}

export function FeedHeader({
  selectedArea,
  onAreaChange,
  liveCount,
  liveArea,
  onOpenJourney,
}: FeedHeaderProps) {
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  return (
    <header className="feed-header">
      <div className="feed-header-inner">
        <Link href="/" className="logo-gold">
          ONLYSA
        </Link>

        <div className="feed-header-controls">
          <div className="area-dropdown-wrap">
            <button
              type="button"
              className="glass-chip"
              onClick={() => setOpen(!open)}
            >
              {selectedArea} <ChevronDown size={14} />
            </button>
            {open && (
              <>
                <div className="dropdown-backdrop" onClick={() => setOpen(false)} />
                <div className="area-dropdown">
                  {FEED_AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        onAreaChange(a);
                        setOpen(false);
                      }}
                      className={selectedArea === a ? "active" : ""}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="streak-btn-modern"
            title="View your journey"
            onClick={onOpenJourney}
          >
            <Flame size={13} className="streak-icon" />
            <span className="streak-btn-label">STREAK</span>
            <span className="streak-btn-num">{streak}</span>
          </button>

          <LiquidButton asChild size="lg" className="say-it-liquid text-[11px] font-bold tracking-[0.14em]">
            <Link href="/post">Say It Anonymous</Link>
          </LiquidButton>

          <Link
            href="/leaderboard"
            className="leaderboard-header-link"
            title="Clout leaderboard"
          >
            Leaderboard
          </Link>
        </div>
      </div>

      <p className="live-pulse-bar">
        <span className="live-dot-wrap" aria-hidden>
          <span className="live-dot-ping" />
          <span className="live-dot-core" />
        </span>
        <span className="live-text">
          {liveCount} South Africans reading {liveArea} right now
        </span>
      </p>
      <div className="header-separator" />
    </header>
  );
}
