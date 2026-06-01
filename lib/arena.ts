import { getClout, addClout, getCurrentIdentity } from "./engagement";
import { getSessionToken } from "./utils";
import type { LeaderboardEntry } from "./leaderboard";

/* ─── Types ─── */

export interface Battle {
  id: string;
  challengerSession: string;
  challengerIdentity: string;
  challengedSession: string;
  challengedIdentity: string;
  topic: string;
  challengerTake: string;
  challengedTake: string | null;
  status: "pending" | "active" | "closed";
  leftVotes: number;
  rightVotes: number;
  voterSessions: string[];
  createdAt: string;
  expiresAt: string;
  winnerId: string | null;
}

export interface ThroneState {
  sessionId: string;
  identity: string;
  clout: number;
  since: string;
  bestPostUpvotes: number;
}

export interface CosignAction {
  action: "cosign" | "cross";
  timestamp: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/* ─── Storage keys ─── */
const KEYS = {
  battles: "onlysa_battles",
  throne: "onlysa_throne",
  cosigns: "onlysa_cosigns",
  notifications: "onlysa_notifications",
};

/* ─── Battle topics ─── */
export const BATTLE_TOPICS = [
  "Nandos vs Steers — settle this forever",
  "Cape Town or Joburg — which city actually works",
  "Is braai culture overrated",
  "Best province in SA — make your case",
  "Load shedding: whose fault is it really",
  "Woolies vs Pick n Pay — choose a side",
  "Is Durban curry better than Cape Malay",
  "SA drivers: who is the worst province",
  "Cold drink: Coke or Cream Soda",
  "Should school uniforms still be a thing",
  "Bunnychow or Gatsby — which is king",
  "Is it ever okay to put pineapple on a burger",
  "Best SA rapper of all time",
  "Is Uber better than metered taxis",
  "Should matric exams be abolished",
];

/* ─── Read / Write helpers ─── */

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ─── Battles ─── */

export function getBattles(): Battle[] {
  return readJSON<Battle[]>(KEYS.battles, []);
}

function saveBattles(battles: Battle[]) {
  writeJSON(KEYS.battles, battles);
}

export function createBattle(
  challengedIdentity: string,
  topic: string,
  challengerTake: string
): Battle {
  const battles = getBattles();
  const session = getSessionToken();
  const myIdentity = getCurrentIdentity();
  const now = new Date();
  const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2h response time

  const battle: Battle = {
    id: crypto.randomUUID(),
    challengerSession: session,
    challengerIdentity: myIdentity,
    challengedSession: challengedIdentity, // simplified — same as identity string
    challengedIdentity,
    topic,
    challengerTake,
    challengedTake: null,
    status: "pending",
    leftVotes: 0,
    rightVotes: 0,
    voterSessions: [],
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    winnerId: null,
  };

  battles.push(battle);
  saveBattles(battles);
  return battle;
}

export function respondToBattle(
  battleId: string,
  take: string
): Battle | null {
  const battles = getBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  if (idx === -1) return null;
  const battle = battles[idx];
  if (battle.status !== "pending") return null;

  battle.challengedTake = take;
  battle.status = "active";
  // Battle now has 24h for voting from response time
  battle.expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();
  battles[idx] = battle;
  saveBattles(battles);
  return battle;
}

export function voteBattle(battleId: string, side: "left" | "right"): Battle | null {
  const session = getSessionToken();
  const battles = getBattles();
  const idx = battles.findIndex(
    (b) => b.id === battleId && b.status === "active"
  );
  if (idx === -1) return null;
  const battle = battles[idx];
  if (battle.voterSessions.includes(session)) return battle; // already voted

  battle.voterSessions.push(session);
  if (side === "left") battle.leftVotes += 1;
  else battle.rightVotes += 1;
  battles[idx] = battle;
  saveBattles(battles);
  return battle;
}

export function closeBattle(battleId: string): Battle | null {
  const battles = getBattles();
  const idx = battles.findIndex((b) => b.id === battleId);
  if (idx === -1) return null;
  const battle = battles[idx];
  if (battle.status === "closed") return battle;

  // Auto-close if expired and no response
  if (battle.status === "pending" && new Date() > new Date(battle.expiresAt)) {
    battle.status = "closed";
    battle.winnerId = battle.challengerSession;
    addClout(100); // default win
  } else if (battle.status === "active") {
    battle.status = "closed";
    battle.winnerId =
      battle.leftVotes >= battle.rightVotes
        ? battle.challengerSession
        : battle.challengedSession;

    const isChallengerWinner = battle.winnerId === battle.challengerSession;
    const winner = isChallengerWinner
      ? battle.challengerIdentity
      : battle.challengedIdentity;

    addClout(isChallengerWinner ? 200 : -50);
    addNotification(
      `${winner} won the battle: "${battle.topic}"`
    );
  }

  battles[idx] = battle;
  saveBattles(battles);
  return battle;
}

export function checkExpiredBattles() {
  const battles = getBattles();
  const now = new Date();
  let changed = false;
  for (let i = 0; i < battles.length; i++) {
    const b = battles[i];
    if (b.status === "closed") continue;
    if (new Date(b.expiresAt) <= now) {
      if (b.status === "pending" && !b.challengedTake) {
        // challenger wins by default
        battles[i].status = "closed";
        battles[i].winnerId = b.challengerSession;
        changed = true;
        addClout(100);
        addNotification(
          `${b.challengerIdentity} won by default — ${b.challengedIdentity} did not respond`
        );
      } else if (b.status === "active") {
        const total = b.leftVotes + b.rightVotes;
        if (total === 0) {
          // draw — no penalty
          battles[i].status = "closed";
          changed = true;
        } else {
          const winner =
            b.leftVotes >= b.rightVotes
              ? b.challengerSession
              : b.challengedSession;
          battles[i].status = "closed";
          battles[i].winnerId = winner;
          changed = true;
          const name =
            winner === b.challengerSession
              ? b.challengerIdentity
              : b.challengedIdentity;
          addClout(winner === b.challengerSession ? 200 : -50);
          addNotification(`${name} won the battle!`);
        }
      }
    }
  }
  if (changed) saveBattles(battles);
}

export function getActiveBattles(): Battle[] {
  checkExpiredBattles();
  return getBattles().filter((b) => b.status === "active" || b.status === "pending");
}

export function hasUserVoted(battle: Battle): boolean {
  const session = getSessionToken();
  return battle.voterSessions.includes(session);
}

export function canUserRespond(battle: Battle): boolean {
  const session = getSessionToken();
  // Respond if challenged and still pending
  return battle.status === "pending" && !battle.challengedTake;
}

/* ─── Throne ─── */

export function getThrone(): ThroneState | null {
  return readJSON<ThroneState | null>(KEYS.throne, null);
}

export function getThroneDuration(since: string): string {
  const diff = Date.now() - new Date(since).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export function attemptThroneShot(upvotes: number): boolean {
  const throne = getThrone();
  if (!throne) return false;
  if (upvotes > throne.bestPostUpvotes) {
    const session = getSessionToken();
    const identity = getCurrentIdentity();
    const newThrone: ThroneState = {
      sessionId: session,
      identity,
      clout: getClout(),
      since: new Date().toISOString(),
      bestPostUpvotes: upvotes,
    };
    writeJSON(KEYS.throne, newThrone);
    addClout(500);
    addNotification(`You took the Throne! Defend it.`);
    return true;
  }
  return false;
}

/* ─── Cosigns ─── */

interface CosignStore {
  [postId: string]: { [sessionId: string]: CosignAction };
}

export function getCosigns(postId: string): { cosigns: number; crosses: number; userAction: CosignAction | null } {
  const store = readJSON<CosignStore>(KEYS.cosigns, {});
  const postCosigns = store[postId] || {};
  const session = getSessionToken();
  const values = Object.values(postCosigns);
  return {
    cosigns: values.filter((v) => v.action === "cosign").length,
    crosses: values.filter((v) => v.action === "cross").length,
    userAction: postCosigns[session] || null,
  };
}

export function submitCosign(postId: string, action: "cosign" | "cross"): {
  cosigns: number;
  crosses: number;
  userAction: CosignAction;
} {
  const store = readJSON<CosignStore>(KEYS.cosigns, {});
  const session = getSessionToken();
  if (!store[postId]) store[postId] = {};
  if (store[postId][session]) {
    // Already voted — return current state
    return {
      cosigns: Object.values(store[postId]).filter((v) => v.action === "cosign").length,
      crosses: Object.values(store[postId]).filter((v) => v.action === "cross").length,
      userAction: store[postId][session],
    };
  }
  store[postId][session] = { action, timestamp: new Date().toISOString() };
  writeJSON(KEYS.cosigns, store);

  const cosigns = Object.values(store[postId]).filter((v) => v.action === "cosign").length;
  const crosses = Object.values(store[postId]).filter((v) => v.action === "cross").length;

  // SA Certified check
  if (action === "cosign" && cosigns >= 100) {
    addNotification("Your take just hit 100 co-signs. SA Certified.");
  }

  // Ratio'd check
  if (crosses >= cosigns * 3 && crosses >= 3) {
    addClout(-20);
    addNotification("SA has spoken. Your take was crossed 3 to 1. -20 clout.");
  }

  return { cosigns, crosses, userAction: { action, timestamp: new Date().toISOString() } };
}

/* ─── Notifications ─── */

export function getNotifications(): Notification[] {
  return readJSON<Notification[]>(KEYS.notifications, []);
}

export function addNotification(message: string) {
  const notifications = getNotifications();
  notifications.unshift({
    id: crypto.randomUUID(),
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  if (notifications.length > 50) notifications.length = 50;
  writeJSON(KEYS.notifications, notifications);
}

export function markNotificationsRead() {
  const notifications = getNotifications();
  for (const n of notifications) n.read = true;
  writeJSON(KEYS.notifications, notifications);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

/* ─── Mock top posts for Cosign Wall ─── */

const MOCK_TAKES = [
  "Cape Town has the best food scene in the country, full stop. Argue with the wall.",
  "Joburg built this country. Cape Town is just a holiday postcard with a mountain in it.",
  "Eskom should be privatised. I said what I said.",
  "Nandos is mid. Steers is the true king of SA fast food.",
  "Durban curry is the only cuisine that represents SA properly.",
  "Load shedding made us stronger as a nation. We adapted.",
  "The N3 at 7am is psychological warfare. Pure and simple.",
  "Bunnychow is the best hangover cure and nothing else comes close.",
  "Woolies is overpriced. Pick n Pay has everything you actually need.",
  "SA drivers are the worst. Especially the ones in taxis.",
  "Pineapple on pizza is fine. You people need to grow up.",
  "Cape Malay curry > Durban curry. The spices are more refined.",
  "Sandton is just a mall with houses attached. Overrated.",
  "The best braai meat is boerewors. Anything else is wrong.",
  "Matric maths paper 3 was a crime against humanity.",
];

export function getMockTopPosts(entries: LeaderboardEntry[]) {
  return entries.map((entry, i) => ({
    id: `cosign-${i}`,
    area: entry.area,
    category: "Hot Take" as const,
    identity: entry.identity,
    content: MOCK_TAKES[i % MOCK_TAKES.length],
    upvotes: Math.floor(Math.random() * 80) + 20,
    comments: Math.floor(Math.random() * 15),
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
  }));
}
