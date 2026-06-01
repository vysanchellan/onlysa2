import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date | string): string {
  const now  = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diff < 60)     return `${diff}s ago`;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function getSessionToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem("onlysa_session");
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("onlysa_session", token);
  }
  return token;
}

export function getRandomIdentity(area: string): string {
  const cityMap: Record<string, string[]> = {
    "Durban CBD":    ["Durban Local", "SA Anonymous", "CBD Resident"],
    Umhlanga:        ["Umhlanga Resident", "KZN Resident", "SA Insider"],
    Westville:       ["Westville Resident", "KZN Resident", "Durban Local"],
    Ballito:         ["Ballito Local", "KZN Resident", "SA Anonymous"],
    PMB:             ["PMB Voice", "KZN Resident", "SA Insider"],
    "Richards Bay":  ["KZN Resident", "SA Anonymous", "SA Insider"],
    Berea:           ["Durban Local", "Berea Resident", "KZN Resident"],
    Musgrave:        ["Musgrave Resident", "Durban Local", "SA Insider"],
    Johannesburg:    ["Joburg Local", "SA Anonymous", "SA Insider"],
    "Cape Town":     ["Cape Town Voice", "SA Anonymous", "SA Insider"],
  };
  const identities = cityMap[area] || ["SA Anonymous", "SA Insider", "KZN Resident"];
  return identities[Math.floor(Math.random() * identities.length)];
}

export const CATEGORIES = [
  "Confession",
  "Rant",
  "Review",
  "Hot Take",
  "Question",
  "Neighbourhood Watch",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const AREAS = [
  "All SA",
  "Durban CBD",
  "Umhlanga",
  "Westville",
  "Ballito",
  "PMB",
  "Richards Bay",
  "Berea",
  "Musgrave",
  "Johannesburg",
  "Cape Town",
] as const;

export type Area = (typeof AREAS)[number];

/** Legacy — kept for any remaining Tailwind class usage */
export function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    Confession:          "badge-confession",
    Rant:                "badge-rant",
    Review:              "badge-review",
    "Hot Take":          "badge-hot-take",
    Question:            "badge-question",
    "Neighbourhood Watch": "badge-neighbourhood-watch",
  };
  return map[category] || "badge-confession";
}

/** New — returns raw colour values for inline-style badges */
export function getCategoryColor(category: string): { bg: string; color: string; border: string } {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    Confession:          { bg: "rgba(230,57,70,0.12)",   color: "#E63946", border: "rgba(230,57,70,0.25)" },
    Rant:                { bg: "rgba(244,83,28,0.12)",   color: "#F4531C", border: "rgba(244,83,28,0.25)" },
    Review:              { bg: "rgba(37,99,235,0.12)",   color: "#5B8DEF", border: "rgba(37,99,235,0.25)" },
    "Hot Take":          { bg: "rgba(217,119,6,0.12)",   color: "#D97706", border: "rgba(217,119,6,0.25)" },
    Question:            { bg: "rgba(124,58,237,0.12)",  color: "#A78BFA", border: "rgba(124,58,237,0.25)" },
    "Neighbourhood Watch": { bg: "rgba(5,150,105,0.12)", color: "#10B981", border: "rgba(5,150,105,0.25)" },
  };
  return map[category] ?? { bg: "rgba(230,57,70,0.12)", color: "#E63946", border: "rgba(230,57,70,0.25)" };
}
