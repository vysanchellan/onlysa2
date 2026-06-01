"use client";

import { motion } from "framer-motion";

type Tab = "recent" | "trending" | "top-rated";

interface FeedTabsGoldProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "recent", label: "Recent" },
  { id: "trending", label: "Trending" },
  { id: "top-rated", label: "Top Reviews" },
];

export function FeedTabsGold({ activeTab, onTabChange }: FeedTabsGoldProps) {
  return (
    <div className="feed-tabs-gold">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`feed-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="feed-tab-underline"
              className="tab-underline"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
