import { getClout, addClout, getCurrentIdentity } from "./engagement";
import { getSessionToken } from "./utils";
import { getSupabase } from "./supabase";
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

/* ─── Supabase mapper ─── */

function mapDbBattle(d: Record<string, unknown>): Battle {
  return {
    id: d.id as string,
    challengerSession: d.challenger_session as string,
    challengerIdentity: d.challenger_identity as string,
    challengedSession: d.challenged_session as string,
    challengedIdentity: d.challenged_identity as string,
    topic: d.topic as string,
    challengerTake: d.challenger_take as string,
    challengedTake: (d.challenged_take as string) || null,
    status: d.status as Battle["status"],
    leftVotes: (d.left_votes as number) ?? 0,
    rightVotes: (d.right_votes as number) ?? 0,
    voterSessions: (d.voter_sessions as string[]) || [],
    createdAt: d.created_at as string,
    expiresAt: d.expires_at as string,
    winnerId: (d.winner_id as string) || null,
  };
}

function mapDbNotification(d: Record<string, unknown>): Notification {
  return {
    id: d.id as string,
    message: d.message as string,
    read: (d.read as boolean) ?? false,
    createdAt: d.created_at as string,
  };
}

/* ─── Battles ─── */

export function getLocalBattles(): Battle[] {
  return readJSON<Battle[]>(KEYS.battles, []);
}

function saveBattles(battles: Battle[]) {
  writeJSON(KEYS.battles, battles);
}

// Fetch battles from Supabase for the current user
export async function fetchBattlesFromSupabase(): Promise<Battle[]> {
  const client = getSupabase();
  if (!client) return [];
  const session = getSessionToken();
  if (!session) return [];
  const { data } = await client
    .from("battles")
    .select("*")
    .or(`challenger_session.eq.${session},challenged_session.eq.${session}`)
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map(mapDbBattle);
}

// Get all battles — merge localStorage with Supabase data
export async function getBattles(): Promise<Battle[]> {
  const local = getLocalBattles();
  const remote = await fetchBattlesFromSupabase();
  if (!remote.length) return local;
  // Merge: remote wins, keep local entries not yet in remote
  const remoteIds = new Set(remote.map((b) => b.id));
  const merged = [...remote];
  for (const b of local) {
    if (!remoteIds.has(b.id)) merged.push(b);
  }
  // Update localStorage cache
  writeJSON(KEYS.battles, merged);
  return merged;
}

async function syncBattlesToSupabase(battles: Battle[]) {
  const client = getSupabase();
  if (!client) return;
  for (const b of battles) {
    void client.from("battles").upsert({
      id: b.id,
      challenger_session: b.challengerSession,
      challenger_identity: b.challengerIdentity,
      challenged_session: b.challengedSession,
      challenged_identity: b.challengedIdentity,
      topic: b.topic,
      challenger_take: b.challengerTake,
      challenged_take: b.challengedTake,
      status: b.status,
      left_votes: b.leftVotes,
      right_votes: b.rightVotes,
      voter_sessions: b.voterSessions,
      created_at: b.createdAt,
      expires_at: b.expiresAt,
      winner_id: b.winnerId,
    }, { onConflict: "id" });
  }
}

export function createBattle(
  challengedIdentity: string,
  topic: string,
  challengerTake: string
): Battle {
  const local = getLocalBattles();
  const session = getSessionToken();
  const myIdentity = getCurrentIdentity();
  const now = new Date();
  const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const battle: Battle = {
    id: crypto.randomUUID(),
    challengerSession: session,
    challengerIdentity: myIdentity,
    challengedSession: challengedIdentity,
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

  local.push(battle);
  saveBattles(local);
  syncBattlesToSupabase(local);
  return battle;
}

export function respondToBattle(
  battleId: string,
  take: string
): Battle | null {
  const local = getLocalBattles();
  const idx = local.findIndex((b) => b.id === battleId);
  if (idx === -1) return null;
  const battle = local[idx];
  if (battle.status !== "pending") return null;

  battle.challengedTake = take;
  battle.status = "active";
  battle.expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();
  local[idx] = battle;
  saveBattles(local);
  syncBattlesToSupabase(local);
  return battle;
}

export function voteBattle(battleId: string, side: "left" | "right"): Battle | null {
  const session = getSessionToken();
  const local = getLocalBattles();
  const idx = local.findIndex(
    (b) => b.id === battleId && b.status === "active"
  );
  if (idx === -1) return null;
  const battle = local[idx];
  if (battle.voterSessions.includes(session)) return battle;

  battle.voterSessions.push(session);
  if (side === "left") battle.leftVotes += 1;
  else battle.rightVotes += 1;
  local[idx] = battle;
  saveBattles(local);
  syncBattlesToSupabase(local);
  return battle;
}

export function closeBattle(battleId: string): Battle | null {
  const local = getLocalBattles();
  const idx = local.findIndex((b) => b.id === battleId);
  if (idx === -1) return null;
  const battle = local[idx];
  if (battle.status === "closed") return battle;

  if (battle.status === "pending" && new Date() > new Date(battle.expiresAt)) {
    battle.status = "closed";
    battle.winnerId = battle.challengerSession;
    addClout(100);
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

  local[idx] = battle;
  saveBattles(local);
  syncBattlesToSupabase(local);
  return battle;
}

export function checkExpiredBattles() {
  const local = getLocalBattles();
  const now = new Date();
  let changed = false;
  for (let i = 0; i < local.length; i++) {
    const b = local[i];
    if (b.status === "closed") continue;
    if (new Date(b.expiresAt) <= now) {
      if (b.status === "pending" && !b.challengedTake) {
        local[i].status = "closed";
        local[i].winnerId = b.challengerSession;
        changed = true;
        addClout(100);
        addNotification(
          `${b.challengerIdentity} won by default — ${b.challengedIdentity} did not respond`
        );
      } else if (b.status === "active") {
        const total = b.leftVotes + b.rightVotes;
        if (total === 0) {
          local[i].status = "closed";
          changed = true;
        } else {
          const winner =
            b.leftVotes >= b.rightVotes
              ? b.challengerSession
              : b.challengedSession;
          local[i].status = "closed";
          local[i].winnerId = winner;
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
  if (changed) {
    saveBattles(local);
    syncBattlesToSupabase(local);
  }
}

export async function getActiveBattles(): Promise<Battle[]> {
  const all = await getBattles();
  return all.filter((b) => b.status === "active" || b.status === "pending");
}

export function hasUserVoted(battle: Battle): boolean {
  const session = getSessionToken();
  return battle.voterSessions.includes(session);
}

export function canUserRespond(battle: Battle): boolean {
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

    const client = getSupabase();
    if (client) {
      void client.from("throne").upsert({
        session_token: session,
        identity,
        clout: getClout(),
        since: newThrone.since,
        best_post_upvotes: upvotes,
      }, { onConflict: "id" });
    }

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
    return {
      cosigns: Object.values(store[postId]).filter((v) => v.action === "cosign").length,
      crosses: Object.values(store[postId]).filter((v) => v.action === "cross").length,
      userAction: store[postId][session],
    };
  }
  const actionEntry: CosignAction = { action, timestamp: new Date().toISOString() };
  store[postId][session] = actionEntry;
  writeJSON(KEYS.cosigns, store);

  const client = getSupabase();
  if (client) {
    void client.from("cosigns").upsert({
      post_id: postId,
      session_token: session,
      action,
      created_at: actionEntry.timestamp,
    }, { onConflict: "post_id, session_token" });
  }

  const cosigns = Object.values(store[postId]).filter((v) => v.action === "cosign").length;
  const crosses = Object.values(store[postId]).filter((v) => v.action === "cross").length;

  if (action === "cosign" && cosigns >= 100) {
    addNotification("Your take just hit 100 co-signs. SA Certified.");
  }

  if (crosses >= cosigns * 3 && crosses >= 3) {
    addClout(-20);
    addNotification("SA has spoken. Your take was crossed 3 to 1. -20 clout.");
  }

  return { cosigns, crosses, userAction: actionEntry };
}

/* ─── Notifications ─── */

export function getLocalNotifications(): Notification[] {
  return readJSON<Notification[]>(KEYS.notifications, []);
}

// Fetch notifications from Supabase for the current user
export async function fetchNotificationsFromSupabase(): Promise<Notification[]> {
  const client = getSupabase();
  if (!client) return [];
  const session = getSessionToken();
  if (!session) return [];
  const { data } = await client
    .from("notifications")
    .select("*")
    .eq("session_token", session)
    .order("created_at", { ascending: false })
    .limit(50);
  if (!data) return [];
  return data.map(mapDbNotification);
}

export async function getNotifications(): Promise<Notification[]> {
  const local = getLocalNotifications();
  const remote = await fetchNotificationsFromSupabase();
  if (!remote.length) return local;
  const remoteIds = new Set(remote.map((n) => n.id));
  const merged = [...remote];
  for (const n of local) {
    if (!remoteIds.has(n.id)) merged.push(n);
  }
  writeJSON(KEYS.notifications, merged);
  return merged;
}

export function addNotification(message: string) {
  const local = getLocalNotifications();
  const notif: Notification = {
    id: crypto.randomUUID(),
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  local.unshift(notif);
  if (local.length > 50) local.length = 50;
  writeJSON(KEYS.notifications, local);

  const client = getSupabase();
  const session = getSessionToken();
  if (client && session) {
    void client.from("notifications").insert({
      id: notif.id,
      session_token: session,
      message,
      read: false,
      created_at: notif.createdAt,
    });
  }
}

export function markNotificationsRead() {
  const local = getLocalNotifications();
  for (const n of local) n.read = true;
  writeJSON(KEYS.notifications, local);

  const client = getSupabase();
  const session = getSessionToken();
  if (client && session) {
    void client.from("notifications")
      .update({ read: true })
      .eq("session_token", session);
  }
}

export async function getUnreadCount(): Promise<number> {
  const all = await getNotifications();
  return all.filter((n) => !n.read).length;
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
