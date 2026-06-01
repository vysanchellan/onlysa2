"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCosigns, submitCosign } from "@/lib/arena";
import { Post } from "@/types";

interface CosignWallProps {
  topPosts: Post[];
}

function CosignCard({ post }: { post: Post }) {
  const [data, setData] = useState({ cosigns: 0, crosses: 0, userAction: null as any });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(getCosigns(post.id));
    setLoading(false);
  }, [post.id]);

  const handleAction = (action: "cosign" | "cross") => {
    if (data.userAction) return;
    const result = submitCosign(post.id, action);
    setData(result);
  };

  const total = data.cosigns + data.crosses;
  const cosignPercent = total > 0 ? Math.round((data.cosigns / total) * 100) : 50;

  return (
    <div className="flex-shrink-0 w-[260px] rounded-[16px] border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">
        {post.identity || "Anonymous"}
      </div>
      <p className="text-[13px] text-white font-medium leading-relaxed mb-3 line-clamp-3">
        {post.content}
      </p>

      {loading ? (
        <div className="h-1 rounded-full bg-white/5 animate-pulse mb-3" />
      ) : (
        <>
          <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#34D399] to-[#059669]"
              initial={{ width: "50%" }}
              animate={{ width: `${cosignPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30 mb-3 font-mono">
            <span>{data.cosigns} co-signs</span>
            <span>{data.crosses} crosses</span>
          </div>
        </>
      )}

      <div className="flex items-stretch gap-2">
        <button
          onClick={() => handleAction("cosign")}
          disabled={!!data.userAction}
          className={`flex items-center justify-center flex-1 py-2 rounded-[10px] text-[10px] font-black tracking-wide uppercase border transition-all duration-200 ${
            data.userAction?.action === "cosign"
              ? "bg-[rgba(52,211,153,0.2)] border-[#34D399] text-[#34D399]"
              : "border-[rgba(52,211,153,0.3)] text-[rgba(52,211,153,0.7)] hover:bg-[rgba(52,211,153,0.08)] disabled:opacity-30"
          }`}
        >
          <span className="leading-none">Co-sign</span>
        </button>
        <button
          onClick={() => handleAction("cross")}
          disabled={!!data.userAction}
          className={`flex items-center justify-center flex-1 py-2 rounded-[10px] text-[10px] font-black tracking-wide uppercase border transition-all duration-200 ${
            data.userAction?.action === "cross"
              ? "bg-[rgba(255,107,107,0.2)] border-[#FF6B6B] text-[#FF6B6B]"
              : "border-[rgba(255,107,107,0.3)] text-[rgba(255,107,107,0.7)] hover:bg-[rgba(255,107,107,0.08)] disabled:opacity-30"
          }`}
        >
          <span className="leading-none">Cross</span>
        </button>
      </div>

      {data.cosigns >= 100 && cosignPercent > 70 && (
        <div className="mt-2 text-center text-[9px] font-black tracking-widest text-[#F5A623] uppercase">
          SA Certified
        </div>
      )}
    </div>
  );
}

export function CosignWall({ topPosts }: CosignWallProps) {
  if (!topPosts.length) return null;

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] text-white/35 uppercase tracking-widest">
            Hot Takes from the Top 10
          </div>
          <div className="text-[13px] text-white font-semibold mt-0.5">
            Co-sign or cross — SA decides
          </div>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {topPosts.map((post) => (
          <CosignCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
