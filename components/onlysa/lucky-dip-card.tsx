"use client";

import { Post } from "@/types";

interface LuckyDipCardProps {
  posts: Post[];
}

export function LuckyDipCard({ posts }: LuckyDipCardProps) {
  function handleClick() {
    if (!posts.length) return;
    const random = posts[Math.floor(Math.random() * posts.length)];
    const el = document.getElementById(`post-${random.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.classList.add("lucky-highlight");
    setTimeout(() => el?.classList.remove("lucky-highlight"), 2000);
  }

  return (
    <button
      type="button"
      className="lucky-dip-card"
      onClick={handleClick}
      disabled={!posts.length}
    >
      <span className="lucky-dip-label">
        Lucky Dip — Anywhere in SA
      </span>
    </button>
  );
}
