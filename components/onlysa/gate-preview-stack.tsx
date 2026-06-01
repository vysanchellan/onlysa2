"use client";

import { useMemo, useState, useCallback } from "react";
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

const PREVIEW_EASE = [0.22, 1, 0.36, 1] as const;

const PREVIEW_TRANSITION = {
  type: "tween" as const,
  duration: 0.2,
  ease: PREVIEW_EASE,
};

function layoutsForFocus(focus: number | null): CardLayout[] {
  const idle: CardLayout[] = [
    { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 },
    { x: -12, y: 24, scale: 0.985, opacity: 1, zIndex: 20 },
    { x: -24, y: 48, scale: 0.97, opacity: 1, zIndex: 10 },
  ];

  if (focus === null) return idle;

  if (focus === 0) {
    return [
      { x: 0, y: -4, scale: 1.015, opacity: 1, zIndex: 40 },
      { x: -8, y: 64, scale: 1, opacity: 1, zIndex: 25 },
      { x: -18, y: 108, scale: 1, opacity: 1, zIndex: 15 },
    ];
  }

  if (focus === 1) {
    return [
      { x: -4, y: 6, scale: 0.98, opacity: 1, zIndex: 15 },
      { x: -12, y: 18, scale: 1.015, opacity: 1, zIndex: 40 },
      { x: -20, y: 70, scale: 1, opacity: 1, zIndex: 28 },
    ];
  }

  return [
    { x: -4, y: 2, scale: 0.975, opacity: 1, zIndex: 12 },
    { x: -10, y: 14, scale: 0.98, opacity: 1, zIndex: 22 },
    { x: -26, y: 40, scale: 1.015, opacity: 1, zIndex: 40 },
  ];
}

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

/** Smooth motion-driven 3-card stack for entry gate */
export function GatePreviewStack({ posts }: GatePreviewStackProps) {
  const [focus, setFocus] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const cards = useMemo(() => {
    const built = postsToCards(posts);
    return built.length > 0 ? built : FALLBACK_CARDS;
  }, [posts]);

  const focused = focus ?? active;
  const layouts = layoutsForFocus(focused);

  const clearFocus = useCallback(() => {
    setFocus(null);
    setActive(null);
  }, []);

  const setCardFocus = useCallback((index: number) => {
    setFocus(index);
  }, []);

  return (
    <div
      className="gate-preview-stack"
      onPointerLeave={clearFocus}
    >
      <div className="gate-preview-grid">
        {cards.map((card, index) => {
          const layout = layouts[index] ?? layouts[0];
          const isFocused = focused === index;

          return (
            <motion.div
              key={`${card.username}-${index}`}
              className="gate-preview-card-wrap"
              style={{ zIndex: layout.zIndex }}
              initial={false}
              animate={{
                x: layout.x,
                y: layout.y,
                scale: layout.scale,
                opacity: layout.opacity,
              }}
              transition={PREVIEW_TRANSITION}
              onPointerEnter={() => setCardFocus(index)}
            >
              <TestimonialCard
                {...card}
                gatePreview
                className={isFocused ? "gate-preview-card-focused" : ""}
                isActive={isFocused}
                onTap={() =>
                  setActive((prev) => (prev === index ? null : index))
                }
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
