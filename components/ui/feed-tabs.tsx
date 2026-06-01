"use client";

type Tab = "recent" | "trending" | "top-rated";

interface FeedTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "recent",    label: "Recent",      icon: "🕐" },
  { id: "trending",  label: "Trending",    icon: "🔥" },
  { id: "top-rated", label: "Top Reviews", icon: "⭐" },
];

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "4px",
      padding: "4px",
      backgroundColor: "#111111",
      borderRadius: "12px",
      border: "1px solid #232323",
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "var(--font-mono, monospace)",
              fontWeight: 500,
              border: isActive ? "1px solid #232323" : "1px solid transparent",
              backgroundColor: isActive ? "#141414" : "transparent",
              color: isActive ? "#F0EDE8" : "#5A5652",
              cursor: "pointer",
              transition: "all 0.18s",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
            }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
