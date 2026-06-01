"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "@/types";
import { SpiralGateScreen } from "@/components/onlysa/spiral-gate-screen";
import { HeroSidebar } from "@/components/onlysa/hero-sidebar";
import { FeedHeader } from "@/components/onlysa/feed-header";
import { FeedTabsGold } from "@/components/onlysa/feed-tabs-gold";
import { GlassPostCard } from "@/components/onlysa/glass-post-card";
import { ChallengeModal } from "@/components/onlysa/challenge-modal";
import { LuckyDipCard } from "@/components/onlysa/lucky-dip-card";
import { JourneyModal } from "@/components/onlysa/journey-modal";
import { AppBottomNav } from "@/components/onlysa/app-bottom-nav";

type Tab = "recent" | "trending" | "top-rated";

const pageEase = [0.22, 1, 0.36, 1] as const;

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: pageEase },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(4px)",
    transition: { duration: 0.3 },
  },
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [area, setArea] = useState("All SA");
  const [tab, setTab] = useState<Tab>("recent");
  const [liveCount, setLiveCount] = useState(47);
  const [liveArea, setLiveArea] = useState("SA");
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem("onlysa_entered");
    if (seen === "1") setEntered(true);

    fetch("/api/posts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.posts?.length) setPosts(d.posts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!entered) return;
    const id = setInterval(() => {
      setLiveCount((c) =>
        Math.max(12, c + Math.floor(Math.random() * 7) - 3)
      );
    }, 30000);
    return () => clearInterval(id);
  }, [entered]);

  useEffect(() => {
    setLiveArea(area === "All SA" ? "SA" : area);
  }, [area]);

  function handleEnter() {
    sessionStorage.setItem("onlysa_entered", "1");
    setEntered(true);
  }

  const filtered = useMemo(() => {
    let list = posts.filter((p) => p.approved !== false);
    if (area !== "All SA") {
      list = list.filter(
        (p) =>
          p.area === area ||
          p.area.toLowerCase().includes(area.toLowerCase().split(" ")[0])
      );
    }
    if (tab === "trending") {
      return [...list].sort((a, b) => b.upvotes - a.upvotes);
    }
    if (tab === "top-rated") {
      return [...list]
        .filter((p) => p.category === "Review")
        .sort((a, b) => b.upvotes - a.upvotes);
    }
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, area, tab]);

  if (!mounted) {
    return <div className="app-shell" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="entry-gate"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SpiralGateScreen onEnter={handleEnter} posts={posts} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="app-shell split-app-shell"
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            <HeroSidebar />

            <div className="feed-column">
              <div className="feed-shell feed-shell-shifted">
                <FeedHeader
                  selectedArea={area}
                  onAreaChange={setArea}
                  liveCount={liveCount}
                  liveArea={liveArea}
                  onOpenJourney={() => setJourneyOpen(true)}
                />

                <FeedTabsGold activeTab={tab} onTabChange={setTab} />

                {filtered.length === 0 ? (
                  <p className="feed-empty">Quiet as load shedding hour.</p>
                ) : (
                  <div className="feed-masonry">
                    {filtered.map((post, i) => {
                      const items: React.ReactNode[] = [];
                      if (i === 2) {
                        items.push(
                          <LuckyDipCard key="lucky-dip" posts={filtered} />
                        );
                      }
                      items.push(
                        <GlassPostCard key={post.id} post={post} index={i} onChallenge={setChallengeTarget} />
                      );
                      return items;
                    })}
                    {filtered.length > 0 && filtered.length <= 2 && (
                      <LuckyDipCard key="lucky-dip-fallback" posts={filtered} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyModal open={journeyOpen} onClose={() => setJourneyOpen(false)} />
      <ChallengeModal
        open={!!challengeTarget}
        onClose={() => setChallengeTarget(null)}
        challengedIdentity={challengeTarget || ""}
      />
      {entered && <AppBottomNav />}
    </>
  );
}
