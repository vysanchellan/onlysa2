"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenLine, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Home, match: (p: string) => p === "/" },
  { href: "/post", label: "Post", icon: PenLine, match: (p: string) => p === "/post" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, match: (p: string) => p.startsWith("/leaderboard") },
  { href: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") },
] as const;

export function AppBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(true);
      return;
    }
    setVisible(sessionStorage.getItem("onlysa_entered") === "1");
  }, [pathname]);

  if (!visible) return null;

  return (
    <nav className="app-bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        const isPost = item.href === "/post";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`app-bottom-nav-item ${active ? "app-bottom-nav-item--active" : ""} ${isPost ? "app-bottom-nav-item--post" : ""}`}
          >
            <Icon size={isPost ? 20 : 18} strokeWidth={active ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
