"use client";

import { Post } from "@/types";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { timeAgo } from "@/lib/utils";
import { getProvince } from "@/lib/constants";

function buildStackCards(posts: Post[], mirrored: boolean, gate: boolean) {
  if (gate) {
    /* Fan outward — away from screen center */
    const x1 = mirrored ? "translate-x-2" : "-translate-x-2";
    const x2 = mirrored ? "translate-x-4" : "-translate-x-4";
    return posts.slice(0, 3).map((post, index) => ({
      className:
        index === 0
          ? "[grid-area:stack] hover:-translate-y-1 transition-all duration-500 z-30"
          : index === 1
            ? `[grid-area:stack] ${x1} translate-y-2.5 hover:-translate-y-0.5 transition-all duration-500 opacity-95 z-20`
            : `[grid-area:stack] ${x2} translate-y-5 hover:translate-y-3 transition-all duration-500 opacity-88 z-10`,
      username: post.identity?.startsWith("ANON") ? post.identity : "Anonymous",
      handle: `${post.area} · ${getProvince(post.area)}`,
      area: post.area,
      category: post.category,
      content: post.content,
      date: timeAgo(post.createdAt),
      likes: post.upvotes,
      retweets: post.comments,
      tweetUrl: `/post/${post.id}`,
    }));
  }

  const x1 = mirrored ? "-translate-x-5 sm:-translate-x-8" : "translate-x-5 sm:translate-x-8";
  const x2 = mirrored ? "-translate-x-10 sm:-translate-x-16" : "translate-x-10 sm:translate-x-16";
  return posts.slice(0, 3).map((post, index) => ({
    className:
      index === 0
        ? "[grid-area:stack] hover:-translate-y-6 transition-all duration-500"
        : index === 1
          ? `[grid-area:stack] ${x1} translate-y-4 sm:translate-y-6 hover:-translate-y-1 transition-all duration-500 opacity-92`
          : `[grid-area:stack] ${x2} translate-y-8 sm:translate-y-12 hover:translate-y-4 transition-all duration-500 opacity-85`,
    username: post.identity?.startsWith("ANON") ? post.identity : "Anonymous",
    handle: `${post.area} · ${getProvince(post.area)}`,
    area: post.area,
    category: post.category,
    content: post.content,
    date: timeAgo(post.createdAt),
    likes: post.upvotes,
    retweets: post.comments,
    tweetUrl: `/post/${post.id}`,
  }));
}

interface GateCardStackProps {
  posts: Post[];
  mirrored?: boolean;
  /** large = full card size + default stack animation (contained on gate) */
  size?: "compact" | "large";
}

/** Single stack for spiral gate side column */
export function GateCardStack({
  posts,
  mirrored = false,
  size = "large",
}: GateCardStackProps) {
  const isLarge = size === "large";
  return (
    <div
      className={`gate-stack-stage ${isLarge ? "gate-stack-stage--large" : ""} ${mirrored ? "gate-stack-stage--right" : "gate-stack-stage--left"}`}
    >
      <Testimonials
        interaction={isLarge ? "default" : "gate"}
        cards={buildStackCards(posts, mirrored, !isLarge)}
      />
    </div>
  );
}

interface DualCardStacksPreviewProps {
  posts: Post[];
  variant?: "default" | "gate";
  compact?: boolean;
}

export function DualCardStacksPreview({
  posts,
  variant = "default",
  compact,
}: DualCardStacksPreviewProps) {
  const gate = variant === "gate";
  const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
  const leftPosts = sorted.slice(0, 3);
  const rightPosts =
    sorted.slice(3, 6).length >= 3 ? sorted.slice(3, 6) : sorted.slice(0, 3);

  return (
    <div
      className={`dual-stacks-preview ${gate ? "gate" : ""} ${compact ? "compact" : ""}`}
    >
      <div className="dual-stack-col">
        <span className="dual-stack-label">Trending</span>
        {gate ? (
          <div className="gate-stack-stage">
            <Testimonials cards={buildStackCards(leftPosts, false, true)} />
          </div>
        ) : (
          <Testimonials cards={buildStackCards(leftPosts, false, false)} />
        )}
      </div>
      <div className="dual-stack-col">
        <span className="dual-stack-label">Recent</span>
        {gate ? (
          <div className="gate-stack-stage">
            <Testimonials cards={buildStackCards(rightPosts, true, true)} />
          </div>
        ) : (
          <Testimonials cards={buildStackCards(rightPosts, true, false)} />
        )}
      </div>
    </div>
  );
}
