"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Triangle, MessageCircle, Share2, Swords, Play } from "lucide-react";
import { Post } from "@/types";
import { timeAgo, getSessionToken, truncate } from "@/lib/utils";
import { CATEGORY_STYLES, formatLocation } from "@/lib/constants";
import { getAnonId } from "@/lib/engagement";
import { ChallengeModal } from "@/components/onlysa/challenge-modal";

interface GlassPostCardProps {
  post: Post;
  index?: number;
}

function cardSizeClass(length: number, hasGif: boolean): string {
  if (hasGif) return "card-with-media";
  if (length < 80) return "card-compact";
  if (length < 200) return "card-medium";
  return "card-tall";
}

export function GlassPostCard({ post, index = 0 }: GlassPostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [gifPaused, setGifPaused] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);

  const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES["Hot Take"];
  const isHot = post.upvotes > 100 || post.isHot;
  const gifUrl = post.gifUrl;
  const clampAt = post.content.length >= 200 ? 160 : 200;
  const long = post.content.length > clampAt;
  const body = expanded || !long ? post.content : truncate(post.content, clampAt);
  const anonLabel = post.identity?.startsWith("ANON")
    ? post.identity
    : getAnonId();

  const sizeClass = useMemo(
    () => cardSizeClass(post.content.length, !!gifUrl),
    [post.content.length, gifUrl]
  );

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setUpvoted((p) => !p);
      setUpvotes((n) => (upvoted ? n - 1 : n + 1));
      try {
        const res = await fetch(`/api/posts/${post.id}/upvote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: getSessionToken() }),
        });
        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
          setUpvoted(data.upvoted);
        }
      } catch {
        setUpvoted((p) => !p);
        setUpvotes((n) => (upvoted ? n + 1 : n - 1));
      }
    },
    [post.id, upvoted]
  );

  return (
    <motion.article
      id={`post-${post.id}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.012 }}
      className={`premium-post-card ${sizeClass} ${isHot ? "is-hot" : ""}`}
    >
      <div className="premium-card-glow" aria-hidden />
      <div className="premium-card-inner">
        <header className="premium-card-header">
          <div className="premium-badges">
            <span
              className="premium-cat-badge"
              style={{ background: cat.bg, color: cat.color, borderColor: `${cat.color}44` }}
            >
              {cat.label}
            </span>
            <span className="premium-meta-dot" aria-hidden>
              ·
            </span>
            <span className="premium-time">{timeAgo(post.createdAt)}</span>
            {isHot && <span className="hot-typo-badge">HOT</span>}
          </div>
          <span className="premium-location">{formatLocation(post.area)}</span>
        </header>

        <p className="premium-anon">{anonLabel}</p>

        <Link href={`/post/${post.id}`} className="premium-body-link">
          <p className="premium-body">
            {body}
            {long && !expanded && (
              <button
                type="button"
                className="premium-read-more"
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded(true);
                }}
              >
                read more
              </button>
            )}
          </p>
        </Link>

        {gifUrl && (
          <div
            className="premium-gif"
            onClick={() => setGifPaused((p) => !p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setGifPaused((p) => !p)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gifUrl} alt="" />
            <span className="premium-gif-tag">GIF</span>
            {gifPaused && (
              <span className="premium-gif-play">
                <Play size={24} fill="white" />
              </span>
            )}
          </div>
        )}

        <footer className="premium-actions">
          <motion.button
            type="button"
            className={`premium-action upvote ${upvoted ? "voted" : ""}`}
            onClick={handleUpvote}
            whileTap={{ scale: 0.92 }}
          >
            <Triangle size={13} fill={upvoted ? "#60A5FA" : "transparent"} />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={upvotes}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {upvotes}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <Link href={`/post/${post.id}`} className="premium-action">
            <MessageCircle size={14} />
            <span>{post.comments}</span>
          </Link>

          <button
            type="button"
            className="premium-action"
            onClick={() => {
              const url = `${window.location.origin}/post/${post.id}`;
              window.open(
                `https://wa.me/?text=${encodeURIComponent(`OnlySA: ${url}`)}`,
                "_blank"
              );
            }}
            aria-label="Share"
          >
            <Share2 size={14} />
          </button>

          <button
            type="button"
            className="premium-action"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setChallengeTarget(post.identity || "Anonymous"); }}
            aria-label="Challenge"
            title={`Challenge ${post.identity || "Anonymous"}`}
          >
            <Swords size={12} />
          </button>
        </footer>
      </div>
      <ChallengeModal
        open={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        challengedIdentity={challengeTarget || ""}
      />
    </motion.article>
  );
}
