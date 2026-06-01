"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, ArrowUp, Share2, Flag } from "lucide-react";
import { Post } from "@/types";
import { Badge } from "./badge";
import { timeAgo, getSessionToken, truncate } from "@/lib/utils";

// Define CategoryBadge and AreaTag here until they are properly placed
const CategoryBadge = ({ category }: { category: string }) => (
  <Badge>{category}</Badge>
);

const AreaTag = ({ area }: { area: string }) => (
  <Badge>{area}</Badge>
);

const C = {
  bgCard:    "#141414",
  bgElev:    "#1C1C1C",
  border:    "#232323",
  text:      "#F0EDE8",
  textMuted: "#5A5652",
  red:       "#E63946",
  green:     "#25D366",
};

interface PostCardProps {
  post: Post;
  className?: string;
  showFull?: boolean;
}

export function PostCard({ post, className, showFull = false }: PostCardProps) {
  const [upvotes, setUpvotes]   = useState(post.upvotes);
  const [upvoted, setUpvoted]   = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isUpvoting) return;
    setIsUpvoting(true);
    const session = getSessionToken();
    setUpvoted(p => !p);
    setUpvotes(p => upvoted ? p - 1 : p + 1);
    try {
      const res = await fetch(`/api/posts/${post.id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: session }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setUpvoted(data.upvoted);
      }
    } catch {
      setUpvoted(p => !p);
      setUpvotes(p => upvoted ? p + 1 : p - 1);
    } finally {
      setIsUpvoting(false);
    }
  }, [post.id, upvoted, isUpvoting]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const url  = `${window.location.origin}/post/${post.id}`;
    const text = `Check this on OnlySA: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [post.id]);

  const content = showFull ? post.content : truncate(post.content, 220);

  return (
    <article
      className={`post-card-hover ${className ?? ""}`}
      style={{
        position: "relative",
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        borderRadius: "12px 12px 0 0",
        background: "linear-gradient(to right, transparent, #2a2a2a, transparent)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <CategoryBadge category={post.category} />
          <AreaTag area={post.area} />
        </div>
        <span style={{ fontSize: "11px", fontFamily: "var(--font-mono,monospace)", color: C.textMuted, flexShrink: 0 }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p style={{ color: C.text, fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" }}>
        {content}
        {!showFull && post.content.length > 220 && (
          <span style={{ color: C.textMuted, marginLeft: "4px", fontSize: "14px" }}>read more</span>
        )}
      </p>

      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(230,57,70,0.6)" }} />
        <span style={{ fontSize: "12px", fontFamily: "var(--font-mono,monospace)", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {post.identity}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingTop: "12px", borderTop: `1px solid rgba(35,35,35,0.6)` }}>
        <ActionBtn
          onClick={handleUpvote}
          active={upvoted}
          activeColor={C.red}
          icon={<ArrowUp size={15} style={{ transform: upvoted ? "scale(1.1)" : "scale(1)", transition: "transform 0.15s" }} />}
          label={String(upvotes)}
        />
        <Link
          href={`/post/${post.id}`}
          onClick={e => e.stopPropagation()}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", color: C.textMuted, textDecoration: "none", fontSize: "13px", fontFamily: "var(--font-mono,monospace)", transition: "all 0.15s" }}
          className="post-action-link"
        >
          <MessageCircle size={15} />
          {post.comments}
        </Link>
        <ActionBtn
          onClick={handleShare}
          icon={<Share2 size={15} />}
          label="Share"
          hoverColor={C.green}
          labelHide
        />
        <button
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "6px 8px", borderRadius: "8px", color: "rgba(90,86,82,0.4)", background: "none", border: "none", cursor: "pointer", transition: "all 0.15s" }}
          title="Something wrong here?"
          aria-label="Report"
          className="post-action-report"
        >
          <Flag size={12} />
        </button>
      </div>

      <style>{`
        .post-card-hover:hover { transform: translateY(-2px); background-color: #181818 !important; border-color: #2a2a2a !important; }
        .post-action-link:hover { color: #F0EDE8 !important; background-color: #1C1C1C; }
        .post-action-report:hover { color: #5A5652 !important; background-color: #1C1C1C; }
      `}</style>
    </article>
  );
}

function ActionBtn({
  onClick, icon, label, active, activeColor, hoverColor, labelHide,
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  labelHide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", borderRadius: "8px",
        fontSize: "13px", fontFamily: "var(--font-mono,monospace)",
        fontWeight: 500,
        color: active && activeColor ? activeColor : "#5A5652",
        backgroundColor: active && activeColor ? `${activeColor}1a` : "transparent",
        border: "none", cursor: "pointer", transition: "all 0.15s",
      }}
      className={hoverColor ? "post-share-btn" : "post-upvote-btn"}
    >
      {icon}
      <span className={labelHide ? "post-action-label-hide" : ""}>{label}</span>
      {hoverColor && (
        <style>{`
          .post-share-btn:hover { color: ${hoverColor} !important; background-color: ${hoverColor}1a !important; }
          .post-action-label-hide { display: none; }
          @media (min-width: 640px) { .post-action-label-hide { display: inline; } }
        `}</style>
      )}
    </button>
  );
}
