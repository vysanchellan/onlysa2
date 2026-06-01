"use client";

import { useEffect, useState } from "react";
import {
  getClout,
  getCurrentIdentity,
  getStreak,
  getTier,
  getTierProgress,
} from "@/lib/engagement";

function GeometricAvatar() {
  return (
    <div className="identity-avatar-geo" aria-hidden>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <polygon
          points="28,4 52,18 52,38 28,52 4,38 4,18"
          stroke="rgba(96,165,250,0.55)"
          strokeWidth="1.5"
          fill="rgba(96,165,250,0.06)"
        />
        <circle cx="28" cy="28" r="8" fill="rgba(96,165,250,0.35)" />
        <circle cx="28" cy="28" r="3" fill="#60A5FA" />
      </svg>
    </div>
  );
}

interface IdentityCardProps {
  onOpenJourney?: () => void;
}

export function IdentityCard({ onOpenJourney }: IdentityCardProps) {
  const [identity, setIdentity] = useState("...");
  const [clout, setClout] = useState(10);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    setIdentity(getCurrentIdentity());
    setClout(getClout());
    setStreak(getStreak());
  }, []);

  const tier = getTier(clout);
  const { percent, nextLabel } = getTierProgress(clout);

  return (
    <button
      type="button"
      className="identity-card identity-card-btn"
      onClick={onOpenJourney}
    >
      <GeometricAvatar />
      <p className="identity-name">{identity.toUpperCase()}</p>
      <p className="identity-sub">YOUR CURRENT ALIAS · TAP FOR JOURNEY</p>

      <div className="identity-clout-row">
        <span className="stat-label">CLOUT: {clout}</span>
        <div className="xp-track-inline">
          <div className="xp-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="stat-tier">
          {tier.name.toUpperCase()} → {nextLabel}
        </span>
      </div>

      <p className="streak-line-typo">
        STREAK {streak} DAY{streak !== 1 ? "S" : ""}
      </p>
    </button>
  );
}
