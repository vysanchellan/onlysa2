"use client";

import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { getThrone, getThroneDuration } from "@/lib/arena";

interface ThroneBannerProps {
  onThroneShot?: () => void;
}

export function ThroneBanner({ onThroneShot }: ThroneBannerProps) {
  const [throne, setThrone] = useState(getThrone());

  useEffect(() => {
    const t = setInterval(() => setThrone(getThrone()), 10_000);
    return () => clearInterval(t);
  }, []);

  if (!throne) return null;

  const duration = getThroneDuration(throne.since);

  return (
    <div className="rounded-[16px] border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.04)] px-5 py-4 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Crown size={12} className="text-[#F5A623]" />
        <div className="text-[10px] text-white/35 tracking-widest uppercase">
          Currently on the Throne
        </div>
      </div>
      <div className="text-[18px] font-black text-[#F5A623] tracking-tight">
        {throne.identity}
      </div>
      <div className="text-[12px] text-white/40 mt-1">
        Reigning for {duration} — {throne.clout.toLocaleString()} clout
      </div>
      {onThroneShot && (
        <button
          onClick={onThroneShot}
          className="mt-3 px-4 py-2 rounded-full border border-[rgba(245,166,35,0.4)] text-[#F5A623] text-[10px] font-black tracking-widest uppercase hover:bg-[rgba(245,166,35,0.1)] transition-all duration-200"
        >
          Attempt Throne Shot
        </button>
      )}
    </div>
  );
}
