"use client";

import { useState, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TestimonialCardProps {
  className?: string;
  compact?: boolean;
  gatePreview?: boolean;
  username?: string;
  handle?: string;
  content?: string;
  date?: string;
  likes?: number;
  retweets?: number;
  tweetUrl?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
  avatar?: string;
  area?: string;
  category?: string;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const CAT_COLORS: Record<string, { dot: string }> = {
  "Rant":                  { dot: "#E87040" },
  "Confession":            { dot: "#E06070" },
  "Review":                { dot: "#6AAF88" },
  "Hot Take":              { dot: "#E8B050" },
  "Question":              { dot: "#6A90B0" },
  "Neighbourhood Watch":   { dot: "#A070C0" },
};

const springConfig = { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.8 };

const motionEase = [0.22, 1, 0.36, 1];

export function TestimonialCard({
  className, compact, gatePreview, username = "Anonymous", handle = "@anonymous",
  content = "This is the most honest I've been on the internet in years.",
  date = "2h ago", likes = 42, retweets = 8,
  tweetUrl = "#", onHover, onLeave, isActive, onTap, avatar, area, category,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (gatePreview) {
      e.preventDefault();
      if (isTouch) onTap?.();
      return;
    }
    if (isTouch && !isActive) {
      e.preventDefault();
      onTap?.();
    }
  };

  const dot = category ? (CAT_COLORS[category]?.dot ?? "#E87040") : "#E87040";

  return (
    <motion.a
      href={tweetUrl} target="_blank" rel="noopener noreferrer"
      onClick={handleClick} onMouseEnter={onHover} onMouseLeave={onLeave}
      className={cn(
        gatePreview
          ? "relative flex h-auto min-h-[172px] w-[252px] max-w-[252px]"
          : compact
            ? "relative flex h-auto min-h-[96px] w-[168px] max-w-full"
            : "relative flex h-auto min-h-[160px] sm:min-h-[200px] w-[280px] sm:w-[400px]",
        gatePreview ? "select-none flex-col rounded-2xl cursor-pointer" : "-skew-y-[5deg] select-none flex-col rounded-2xl cursor-pointer",
        isActive && "ring-2 ring-[#60A5FA]/40",
        className
      )}
      style={{
        background: gatePreview ? "#0f0f12" : "rgba(13,13,16,0.92)",
        border: gatePreview
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(255,255,255,0.08)",
        padding: "20px 24px",
        textDecoration: "none",
        backdropFilter: gatePreview ? undefined : "blur(20px)",
        WebkitBackdropFilter: gatePreview ? undefined : "blur(20px)",
        boxShadow: gatePreview ? "0 12px 32px rgba(0,0,0,0.45)" : undefined,
        willChange: "transform",
      }}
      whileHover={gatePreview ? undefined : { scale: 1.015, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg, #60A5FA, #3B82F6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:700, color:"#fff",
            fontFamily:"'Syne', sans-serif",
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"rgba(242,238,233,0.9)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.01em" }}>{username}</div>
            <div style={{ fontSize:11, color:"rgba(160,154,147,0.7)", fontFamily:"'DM Mono',monospace", marginTop:1 }}>{handle}</div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          {category && (
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:dot }} />
              <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:dot, textTransform:"uppercase", letterSpacing:"0.1em" }}>{category}</span>
            </div>
          )}
          {area && <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"rgba(160,154,147,0.5)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{area}</span>}
        </div>
      </div>

      <p style={{
        fontSize:14, lineHeight:1.6, color:"rgba(242,238,233,0.78)",
        flex:1, marginBottom:16,
        display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden",
        fontFamily:"'DM Sans',sans-serif", fontWeight:300,
      }}>
        {content}
      </p>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"rgba(160,154,147,0.45)" }}>{date}</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.45)", fontFamily:"'DM Mono',monospace" }}>
            <svg style={{ width:12,height:12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {likes}
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.45)", fontFamily:"'DM Mono',monospace" }}>
            <svg style={{ width:12,height:12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            {retweets}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

interface TestimonialsProps {
  cards?: TestimonialCardProps[];
  interaction?: "default" | "gate" | "preview";
}

// Spring-based layout offsets for smooth stacking
function cardOffsets(focused: number | null, interaction: "default" | "gate" | "preview", index: number) {
  const base = { x: 0, y: 0, scale: 1, opacity: 1 };

  if (interaction === "preview") {
    if (focused === null) {
      if (index === 0) return { x: 0, y: 0, scale: 1, opacity: 1 };
      if (index === 1) return { x: -10, y: 28, scale: 0.985, opacity: 1 };
      if (index === 2) return { x: -20, y: 56, scale: 0.97, opacity: 1 };
    } else if (focused === 0) {
      if (index === 0) return { x: 0, y: -6, scale: 1.02, opacity: 1 };
      if (index === 1) return { x: -8, y: 72, scale: 1, opacity: 1 };
      if (index === 2) return { x: -20, y: 120, scale: 1, opacity: 1 };
    } else if (focused === 1) {
      if (index === 0) return { x: -4, y: 4, scale: 0.98, opacity: 1 };
      if (index === 1) return { x: -10, y: 20, scale: 1.02, opacity: 1 };
      if (index === 2) return { x: -20, y: 64, scale: 1, opacity: 1 };
    }
    return base;
  }

  if (interaction === "gate") {
    if (focused === null) {
      if (index === 0) return { x: 0, y: 0, scale: 1, opacity: 1 };
      if (index === 1) return { x: -8, y: 12, scale: 0.99, opacity: 0.95 };
      if (index === 2) return { x: -16, y: 24, scale: 0.98, opacity: 0.9 };
    } else if (focused === 0) {
      if (index === 0) return { x: 0, y: -4, scale: 1.01, opacity: 1 };
      if (index === 1) return { x: -4, y: 16, scale: 0.99, opacity: 0.97 };
      if (index === 2) return { x: -12, y: 32, scale: 0.98, opacity: 0.93 };
    } else if (focused === 1) {
      if (index === 0) return { x: -2, y: 2, scale: 0.99, opacity: 0.96 };
      if (index === 1) return { x: -6, y: 10, scale: 1.01, opacity: 1 };
      if (index === 2) return { x: -14, y: 28, scale: 0.99, opacity: 0.95 };
    }
    return base;
  }

  // default
  if (focused === null) {
    if (index === 0) return { x: 0, y: 0, scale: 1, opacity: 1 };
    if (index === 1) return { x: 24, y: 32, scale: 0.98, opacity: 0.92 };
    if (index === 2) return { x: 48, y: 64, scale: 0.96, opacity: 0.85 };
  } else if (focused === 0) {
    if (index === 0) return { x: 0, y: -8, scale: 1.02, opacity: 1 };
    if (index === 1) return { x: 48, y: 128, scale: 1, opacity: 0.98 };
    if (index === 2) return { x: 80, y: 176, scale: 1, opacity: 0.96 };
  } else if (focused === 1) {
    if (index === 0) return { x: 4, y: 6, scale: 0.98, opacity: 0.88 };
    if (index === 1) return { x: 20, y: 24, scale: 1.02, opacity: 1 };
    if (index === 2) return { x: 80, y: 160, scale: 1, opacity: 0.96 };
  }
  return base;
}

export function Testimonials({ cards, interaction = "default" }: TestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex]   = useState<number | null>(null);
  const isGate = interaction === "gate";
  const isPreview = interaction === "preview";

  const focused = hoveredIndex ?? activeIndex;

  const previewFallbackCards: TestimonialCardProps[] = [
    {
      username: "Westville Resident",
      handle: "@westville_za",
      area: "Westville",
      category: "Rant",
      content:
        "The N3 at 7am should be classified as psychological torture. Still sitting here watching a bakkie inch forward.",
      date: "2h ago",
      likes: 201,
      retweets: 33,
      tweetUrl: "#",
    },
    {
      username: "Umhlanga Resident",
      handle: "@umhlanga_za",
      area: "Umhlanga",
      category: "Hot Take",
      content:
        "Umhlanga is just Sandton with a beach view and twice the attitude.",
      date: "5h ago",
      likes: 88,
      retweets: 21,
      tweetUrl: "#",
    },
    {
      username: "Joburg Local",
      handle: "@joburg_za",
      area: "Johannesburg",
      category: "Rant",
      content: "Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am.",
      date: "8h ago",
      likes: 312,
      retweets: 41,
      tweetUrl: "#",
    },
  ];

  const defaultCards: TestimonialCardProps[] = [
    {
      username:"Westville Resident", handle:"@westville_za", area:"Westville", category:"Rant",
      content:"The N3 at 7am should be classified as psychological torture. Left home at 6:45 to beat traffic. Still sitting here watching a bakkie inch forward. That is all.",
      date:"2h ago", likes:201, retweets:33,
    },
    {
      username:"Umhlanga Resident", handle:"@umhlanga_za", area:"Umhlanga", category:"Hot Take",
      content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back.",
      date:"5h ago", likes:88, retweets:21,
    },
    {
      username:"Joburg Local", handle:"@joburg_za", area:"Johannesburg", category:"Rant",
      content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.",
      date:"8h ago", likes:312, retweets:41,
    },
  ];

  const displayCards =
    cards ?? (isPreview ? previewFallbackCards : defaultCards);

  return (
    <div
      className={cn(
        "grid [grid-template-areas:'stack']",
        isPreview ? "gate-preview-grid" : "place-items-center",
        isGate && "gate-testimonials-grid"
      )}
    >
      {displayCards.map((cardProps, index) => {
        const offset = cardOffsets(focused, interaction, index);
        return (
          <div
            key={index}
            style={{ gridArea: "stack", willChange: "transform" }}
          >
            <motion.div
              animate={{
                x: offset.x,
                y: offset.y,
                scale: offset.scale,
                opacity: offset.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                mass: 0.5,
              }}
              style={{ willChange: "transform" }}
            >
              <TestimonialCard
                {...cardProps}
                compact={isGate}
                gatePreview={isPreview}
                className={cn(
                  focused === index && "!z-50",
                  !isPreview && !isGate && index === 0 && focused !== 0 && "before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:bg-black/55 before:pointer-events-none",
                  !isPreview && !isGate && index === 1 && focused !== 1 && "before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:bg-black/55 before:pointer-events-none",
                )}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                isActive={activeIndex === index}
                onTap={() => setActiveIndex(activeIndex === index ? null : index)}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export type { TestimonialCardProps, TestimonialsProps };
