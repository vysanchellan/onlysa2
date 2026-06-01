"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Post } from "@/types";
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/components/ui/twitter-testimonial-cards";
import { timeAgo } from "@/lib/utils";
import { getProvince } from "@/lib/constants";

type CardLayout = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const PREVIEW_TRANSITION = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
  mass: 0.8,
};

const IDLE_LAYOUTS: CardLayout[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 },
  { x: -8, y: 16, scale: 0.99, opacity: 1, zIndex: 20 },
  { x: -16, y: 32, scale: 0.98, opacity: 1, zIndex: 10 },
];

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

/** Decorative 3-card stack for the landing screen — no interaction */
export function GatePreviewStack({ posts }: GatePreviewStackProps) {
  const cards = useMemo(() => {
    const built = postsToCards(posts);
    return built.length > 0 ? built : FALLBACK_CARDS;
  }, [posts]);

  return (
    <div className="gate-preview-stack">
      <div className="gate-preview-grid">
        {cards.map((card, index) => {
          const layout = IDLE_LAYOUTS[index] ?? IDLE_LAYOUTS[0];

          return (
            <motion.div
              key={`${card.username}-${index}`}
              className="gate-preview-card-wrap"
              style={{ zIndex: layout.zIndex, willChange: "transform", pointerEvents: "none", userSelect: "none" }}
              initial={{ opacity: 0, y: layout.y + 40, scale: 0.95 }}
              animate={{
                x: layout.x,
                y: layout.y,
                scale: layout.scale,
                opacity: layout.opacity,
              }}
              transition={{ delay: index * 0.07, ...PREVIEW_TRANSITION }}
            >
              <TestimonialCard {...card} gatePreview />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
