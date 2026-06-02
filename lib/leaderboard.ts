import { SA_IDENTITIES } from "./constants";
import { getClout, getCurrentIdentity, getTier } from "./engagement";
import { getSupabase } from "./supabase";

export interface LeaderboardEntry {
  rank: number;
  identity: string;
  cloutScore: number;
  postCount: number;
  tier: string;
  area: string;
  isCurrentUser?: boolean;
}

export const LEADERBOARD_AREAS = [
  "All SA",
  "Joburg",
  "Cape Town",
  "Durban",
  "Pretoria",
  "Port Elizabeth",
] as const;

export type LeaderboardArea = (typeof LEADERBOARD_AREAS)[number];

const AREA_HINTS: Record<string, string[]> = {
  Joburg: ["sandton", "soweto", "joburg", "pretoria"],
  "Cape Town": ["cape", "stellenbosch"],
  Durban: ["durban", "umhlanga", "kzn"],
  Pretoria: ["pretoria"],
  "Port Elizabeth": ["port elizabeth", "east london"],
};

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function mockClout(identity: string, weekSeed: number): number {
  const base = hashSeed(identity + String(weekSeed)) % 4800;
  return 120 + base;
}

function mockPosts(identity: string, weekSeed: number): number {
  return 3 + (hashSeed(identity + "p" + weekSeed) % 14);
}

function identityMatchesArea(identity: string, area: LeaderboardArea): boolean {
  if (area === "All SA") return true;
  const lower = identity.toLowerCase();
  const hints = AREA_HINTS[area] ?? [area.toLowerCase()];
  return hints.some((h) => lower.includes(h));
}

function weekSeed(): number {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.floor(
    (d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  return week;
}

export function getWeekResetLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(0, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  const d = Math.floor(diff / (24 * 60 * 60 * 1000));
  const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return `Resets in ${d}d ${h}h ${m}m`;
}

export async function fetchLeaderboard(area: LeaderboardArea): Promise<LeaderboardEntry[]> {
  const seed = weekSeed();
  const currentIdentity =
    typeof window !== "undefined" ? getCurrentIdentity() : SA_IDENTITIES[0];
  const currentClout = typeof window !== "undefined" ? getClout() : 10;
  const currentTier = getTier(currentClout).name;

  // Try to pull real identities from Supabase
  let dbIdentities: { identity: string; clout: number; session_token: string }[] = [];
  const client = getSupabase();
  if (client) {
    const { data } = await client
      .from("identities")
      .select("identity, clout, session_token")
      .order("clout", { ascending: false })
      .limit(50);
    if (data?.length) {
      dbIdentities = data as { identity: string; clout: number; session_token: string }[];
    }
  }

  let entries: LeaderboardEntry[];

  if (dbIdentities.length > 0) {
    // Use real identities from DB
    let pool = dbIdentities.map((row) => ({
      identity: row.identity || SA_IDENTITIES[0],
      cloutScore: row.clout,
      postCount: mockPosts(row.session_token, seed), // fallback until we track post count by session
      tier: getTier(row.clout).name,
      area: area === "All SA" ? "SA" : area,
    }));

    if (area !== "All SA") {
      pool = pool.filter((e) => identityMatchesArea(e.identity, area));
    }

    pool.sort((a, b) => b.cloutScore - a.cloutScore);

    entries = pool.slice(0, 50).map((row, i) => ({
      rank: i + 1,
      ...row,
      isCurrentUser: row.identity === currentIdentity,
    }));
  } else {
    // Fallback to mock data
    let filteredIds = SA_IDENTITIES.filter((id) => identityMatchesArea(id, area));
    if (filteredIds.length < 8) filteredIds = [...SA_IDENTITIES];

    const pool = filteredIds
      .map((identity) => ({
        identity,
        cloutScore: mockClout(identity, seed),
        postCount: mockPosts(identity, seed),
        tier: getTier(mockClout(identity, seed)).name,
        area: area === "All SA" ? "SA" : area,
      }))
      .sort((a, b) => b.cloutScore - a.cloutScore)
      .slice(0, 50);

    entries = pool.map((row, i) => ({
      rank: i + 1,
      ...row,
      isCurrentUser: row.identity === currentIdentity,
    }));
  }

  const userInList = entries.some((e) => e.isCurrentUser);
  if (!userInList) {
    entries.push({
      rank: 47,
      identity: currentIdentity,
      cloutScore: currentClout,
      postCount: Math.max(1, mockPosts(currentIdentity, seed) % 5),
      tier: currentTier,
      area: area === "All SA" ? "SA" : area,
      isCurrentUser: true,
    });
  }

  return entries;
}

export function getTierDisplayColor(tierName: string): string {
  const map: Record<string, string> = {
    Rookie: "rgba(255,255,255,0.4)",
    Novice: "rgba(255,255,255,0.5)",
    Local: "#60A5FA",
    Legend: "#A78BFA",
    GOAT: "#60A5FA",
    "SA Icon": "#FF6B6B",
  };
  return map[tierName] ?? "rgba(255,255,255,0.4)";
}

export function getRankBorderColor(rank: number): string | undefined {
  if (rank === 1) return "#60A5FA";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return undefined;
}
