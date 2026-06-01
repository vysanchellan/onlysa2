"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface StackPost {
  id: string;
  content: string;
  category: string;
  area: string;
  authorLabel: string;
  createdAt: string;
  votes: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Rant:       { bg: "rgba(37,99,235,0.18)",  text: "#93c5fd", border: "rgba(59,130,246,0.35)"  },
  Confession: { bg: "rgba(59,130,246,0.18)", text: "#60a5fa", border: "rgba(96,165,250,0.35)" },
  Review:     { bg: "rgba(30,64,175,0.2)",   text: "#3b82f6", border: "rgba(37,99,235,0.35)" },
  "Hot Take": { bg: "rgba(56,189,248,0.18)", text: "#38bdf8", border: "rgba(56,189,248,0.35)" },
  Question:   { bg: "rgba(96,165,250,0.18)", text: "#7dd3fc", border: "rgba(125,211,252,0.35)" },
  "Neighbourhood Watch": { bg: "rgba(29,78,216,0.2)", text: "#2563eb", border: "rgba(37,99,235,0.35)" },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function SAIcon() {
  return (
    <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );
}

const springTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.6,
};

interface PostCardProps {
  post: StackPost;
  className?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function StackedPostCard({ post, className = "", onHover, onLeave, isActive, onTap }: PostCardProps) {
  const colors = CATEGORY_COLORS[post.category] ?? { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.15)" };

  return (
    <motion.div
      onClick={() => {
        const isTouch = "ontouchstart" in window;
        if (isTouch && !isActive) { onTap?.(); return; }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      layout
      className={`
        relative flex h-auto min-h-[150px] w-[280px] sm:w-[360px]
        -skew-y-[6deg] select-none flex-col rounded-2xl
        px-4 py-4 cursor-pointer
        ${isActive ? "ring-2 ring-emerald-400/40" : ""}
        ${className}
      `}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        willChange: "transform",
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="absolute -right-1 top-0 h-full w-24 rounded-r-2xl pointer-events-none"
        style={{ background: "linear-gradient(to left, #070709, transparent)" }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
            style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
          >
            {post.category.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/80">{post.authorLabel}</p>
            <p className="text-[10px] text-white/30 font-mono">{post.area} · {timeAgo(post.createdAt)} ago</p>
          </div>
        </div>
        <SAIcon />
      </div>

      <p className="text-[13px] text-white/65 leading-relaxed line-clamp-3 mb-3">
        {post.content}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
        >
          {post.category}
        </span>
        <div className="flex items-center gap-1 text-white/30 text-[11px] font-mono">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          </svg>
          {post.votes}
        </div>
      </div>
    </motion.div>
  );
}

interface PostStackCardsProps {
  posts?: StackPost[];
}

const DEFAULT_POSTS: StackPost[] = [
  {
    id: "a",
    content: "Eskom scheduled maintenance 8am–4pm. Power off at 8:01am. Back on at 5:47pm. Living in SA is peak comedy.",
    category: "Rant",
    area: "Johannesburg",
    authorLabel: "Joburg Local",
    createdAt: new Date(Date.now() - 1000*60*20).toISOString(),
    votes: 312,
  },
  {
    id: "b",
    content: "Hot take: bunnychow is the only correct hangover cure and anyone who disagrees has never been to Durban.",
    category: "Hot Take",
    area: "Durban CBD",
    authorLabel: "Durban Local",
    createdAt: new Date(Date.now() - 1000*60*90).toISOString(),
    votes: 119,
  },
  {
    id: "c",
    content: "My neighbour's car alarm has been going off at 2am for three weeks. I have transcended anger. I am the noise.",
    category: "Confession",
    area: "Berea",
    authorLabel: "Berea Resident",
    createdAt: new Date(Date.now() - 1000*60*60*5).toISOString(),
    votes: 201,
  },
];

function stackOffsets(focused: number | null | undefined, index: number) {
  const base = { x: 0, y: 0, scale: 1, opacity: 1 };

  if (focused === null || focused === undefined) {
    if (index === 0) return { x: 0, y: 0, scale: 1, opacity: 1 };
    if (index === 1) return { x: 32, y: 24, scale: 0.98, opacity: 0.95 };
    if (index === 2) return { x: 64, y: 48, scale: 0.96, opacity: 0.88 };
  }

  if (focused === 0) {
    if (index === 0) return { x: 0, y: -8, scale: 1.02, opacity: 1 };
    if (index === 1) return { x: 40, y: 80, scale: 1, opacity: 1 };
    if (index === 2) return { x: 80, y: 112, scale: 1, opacity: 1 };
  }

  if (focused === 1) {
    if (index === 0) return { x: 4, y: 4, scale: 0.97, opacity: 0.9 };
    if (index === 1) return { x: 24, y: 20, scale: 1.02, opacity: 1 };
    if (index === 2) return { x: 80, y: 112, scale: 1, opacity: 0.95 };
  }

  return base;
}

export function PostStackCards({ posts }: PostStackCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive]   = useState<number | null>(null);

  const displayPosts = (posts ?? DEFAULT_POSTS).slice(0, 3);
  const focused = hovered ?? active;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayPosts.map((post, i) => {
        const offset = stackOffsets(focused, i);
        return (
          <div key={post.id} style={{ gridArea: "stack" }}>
            <motion.div
              animate={{
                x: offset.x,
                y: offset.y,
                scale: offset.scale,
                opacity: offset.opacity,
              }}
              transition={springTransition}
              style={{ willChange: "transform" }}
            >
              <StackedPostCard
                post={post}
                onHover={() => setHovered(i)}
                onLeave={() => setHovered(null)}
                isActive={active === i}
                onTap={() => setActive(active === i ? null : i)}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default PostStackCards;
