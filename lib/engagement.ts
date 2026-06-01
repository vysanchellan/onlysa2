import { SA_IDENTITIES, TIERS } from "./constants";

const KEYS = {
  clout: "onlysa_clout",
  streak: "onlysa_streak",
  lastPost: "onlysa_last_post_date",
  identity: "onlysa_identity",
  identityAt: "onlysa_identity_at",
} as const;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readNum(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v ? parseInt(v, 10) || fallback : fallback;
}

function write(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getClout(): number {
  return readNum(KEYS.clout, 10);
}

export function addClout(amount: number) {
  write(KEYS.clout, String(getClout() + amount));
}

export function getStreak(): number {
  return readNum(KEYS.streak, 1);
}

export function recordPostActivity() {
  const today = todayKey();
  const last = localStorage.getItem(KEYS.lastPost);
  let streak = getStreak();

  if (!last) {
    streak = 1;
  } else if (last === today) {
    // same day — no change
  } else {
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.round(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    streak = diffDays === 1 ? streak + 1 : 1;
  }

  write(KEYS.streak, String(streak));
  write(KEYS.lastPost, today);
  addClout(3);
}

export function getStreakFlames(streak: number): string {
  if (streak >= 30) return "ON FIRE";
  if (streak >= 7) return "BLAZING";
  if (streak >= 3) return "WARM";
  return "";
}

export function getCurrentIdentity(): string {
  if (typeof window === "undefined") return SA_IDENTITIES[0];

  const stored = localStorage.getItem(KEYS.identity);
  const assignedAt = localStorage.getItem(KEYS.identityAt);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  if (stored && assignedAt && now - parseInt(assignedAt, 10) < dayMs) {
    return stored;
  }

  const next =
    SA_IDENTITIES[Math.floor(Math.random() * SA_IDENTITIES.length)];
  write(KEYS.identity, next);
  write(KEYS.identityAt, String(now));
  return next;
}

export function getTier(clout = getClout()) {
  let tier: (typeof TIERS)[number] = TIERS[0];
  for (const t of TIERS) {
    if (clout >= t.min) tier = t;
  }
  return tier;
}

export function getTierProgress(clout = getClout()) {
  const tier = getTier(clout);
  const idx = TIERS.findIndex((t) => t.name === tier.name);
  const next = TIERS[idx + 1];
  if (!next) return { percent: 100, nextLabel: "MAX" };
  const range = next.min - tier.min;
  const progress = clout - tier.min;
  return {
    percent: Math.min(100, Math.round((progress / range) * 100)),
    nextLabel: next.name,
  };
}

export function getAnonId(): string {
  if (typeof window === "undefined") return "ANON 000";
  let id = localStorage.getItem("onlysa_anon_id");
  if (!id) {
    id = String(Math.floor(100 + Math.random() * 900));
    localStorage.setItem("onlysa_anon_id", id);
  }
  return `ANON ${id}`;
}
