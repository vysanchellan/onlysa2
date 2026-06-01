"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Post } from "@/types";
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/components/ui/twitter-testimonial-cards";
import { timeAgo } from "@/lib/utils";
import { getProvince } from "@/lib/constants";

function postsToCards(posts: Post[]): TestimonialCardProps[] {
  return posts.slice(0, 3).map((post) => ({
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

const FALLBACK_CARDS: TestimonialCardProps[] = [
  {
    username: "Westville Resident",
    handle: "Westville · KZN",
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
    handle: "Umhlanga · KZN",
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
    handle: "Joburg · GP",
    area: "Johannesburg",
    category: "Rant",
    content: "Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am.",
    date: "8h ago",
    likes: 312,
    retweets: 41,
    tweetUrl: "#",
  },
];

interface GatePreviewStackProps {
  posts: Post[];
}

const STACK_POSITIONS = [
  { translate: 0, scale: 1, opacity: 1, z: 30 },
  { translate: 14, scale: 0.94, opacity: 0.6, z: 20 },
  { translate: 28, scale: 0.88, opacity: 0.35, z: 10 },
];

const SPRING = { type: "spring" as const, stiffness: 200, damping: 26, mass: 0.7 };

/** Decorative 3-card depth stack that cycles every 4s */
export function GatePreviewStack({ posts }: GatePreviewStackProps) {
  const cards = useMemo(() => {
    const built = postsToCards(posts);
    return built.length > 0 ? built : FALLBACK_CARDS;
  }, [posts]);

  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    if (cards.length < 2) return;
    const t = setInterval(() => setTopIndex((p) => (p + 1) % cards.length), 4000);
    return () => clearInterval(t);
  }, [cards.length]);

  return (
    <div className="relative w-[300px] h-[260px]">
      {cards.map((card, index) => {
        const stackPos = (index - topIndex + cards.length) % cards.length;
        const pos = STACK_POSITIONS[stackPos] ?? STACK_POSITIONS[0];

        return (
          <motion.div
            key={`${card.username}-${index}`}
            className="absolute top-0 left-0"
            style={{ pointerEvents: "none", userSelect: "none" }}
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{
              x: pos.translate,
              y: pos.translate,
              scale: pos.scale,
              opacity: pos.opacity,
              zIndex: pos.z,
            }}
            transition={SPRING}
          >
            <TestimonialCard {...card} gatePreview />
          </motion.div>
        );
      })}
    </div>
  );
}
