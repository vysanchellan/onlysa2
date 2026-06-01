"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Zap, MessageCircle, PenLine, Trophy } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { getClout, getStreak, getTier } from "@/lib/engagement";

interface JourneyModalProps {
  open: boolean;
  onClose: () => void;
}

const journeyNodes = [
  {
    id: 1,
    title: "First Drop",
    date: "Day 1",
    content: "You entered the feed anonymously. No name. No face.",
    category: "Origin",
    icon: PenLine,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Umlilo Streak",
    date: "Active",
    content: "Post once every 24 hours to keep the flame alive.",
    category: "Streak",
    icon: Flame,
    relatedIds: [1, 3],
    status: "in-progress" as const,
    energy: 72,
  },
  {
    id: 3,
    title: "Clout Rising",
    date: "This week",
    content: "Upvotes and posts build your anonymous reputation.",
    category: "Karma",
    icon: Zap,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 4,
    title: "Local Legend",
    date: "Next tier",
    content: "Earn enough clout to rank up in your city.",
    category: "Rank",
    icon: Trophy,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 28,
  },
  {
    id: 5,
    title: "The Feed",
    date: "Always on",
    content: "South Africans reading, posting, transmitting truth.",
    category: "Community",
    icon: MessageCircle,
    relatedIds: [4],
    status: "pending" as const,
    energy: 90,
  },
];

export function JourneyModal({ open, onClose }: JourneyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const clout = typeof window !== "undefined" ? getClout() : 10;
  const streak = typeof window !== "undefined" ? getStreak() : 1;
  const tier = getTier(clout);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="journey-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="journey-modal-host">
            <motion.div
              className="journey-modal"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="journey-modal-top">
                <div>
                  <h2 className="journey-title">Your Journey</h2>
                  <p className="journey-stats">
                    STREAK {streak} · CLOUT {clout} · {tier.name.toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  className="journey-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="journey-orbital-wrap">
                <RadialOrbitalTimeline timelineData={journeyNodes} compact />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
