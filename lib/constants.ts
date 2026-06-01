export const COLORS = {
  bgPrimary: "#0A0A0A",
  bgSurface: "#111111",
  bgSurfaceAlt: "#1A1A1A",
  accentPrimary: "#60A5FA",
  accentSecondary: "#3B82F6",
  accentDeep: "#2563EB",
  accentBright: "#93C5FD",
  accentGold: "#60A5FA",
  accentAmber: "#3B82F6",
  accentHot: "#FF4444",
  textPrimary: "#FFFFFF",
  textSecondary: "#888888",
  glassSurface: "rgba(255,255,255,0.04)",
  success: "#2ECC71",
} as const;

/** Official SA flag colours for particles & brand moments */
export const SA_FLAG = {
  green: "#007A4D",
  blue: "#001489",
  red: "#DE3831",
  black: "#000000",
  white: "#FFFFFF",
  yellow: "#FFB81C",
  /** Alias for blue */
  navy: "#001489",
  /** Alias for yellow */
  gold: "#FFB81C",
} as const;

/** Particle sphere: green, blue, red, green, black, white, yellow */
export const SA_FLAG_PARTICLE_COLORS = [
  SA_FLAG.green,
  SA_FLAG.blue,
  SA_FLAG.red,
  SA_FLAG.green,
  SA_FLAG.black,
  SA_FLAG.white,
  SA_FLAG.yellow,
] as const;

export const CATEGORY_STYLES: Record<
  string,
  { emoji: string; bg: string; color: string; label: string }
> = {
  Rant: {
    emoji: "😤",
    bg: "rgba(255, 107, 107, 0.12)",
    color: "#FF6B6B",
    label: "RANT",
  },
  Confession: {
    emoji: "🙏",
    bg: "rgba(167, 139, 250, 0.12)",
    color: "#A78BFA",
    label: "CONFESSION",
  },
  "Hot Take": {
    emoji: "🔥",
    bg: "rgba(245, 166, 35, 0.12)",
    color: "#F5A623",
    label: "HOT TAKE",
  },
  Question: {
    emoji: "❓",
    bg: "rgba(96, 165, 250, 0.12)",
    color: "#60A5FA",
    label: "QUESTION",
  },
  Review: {
    emoji: "⭐",
    bg: "rgba(52, 211, 153, 0.12)",
    color: "#34D399",
    label: "REVIEW",
  },
  "Neighbourhood Watch": {
    emoji: "👀",
    bg: "rgba(251, 191, 36, 0.12)",
    color: "#FBBF24",
    label: "NEIGHBOURHOOD WATCH",
  },
};

export const POST_AREAS = [
  { name: "Joburg", province: "GP" },
  { name: "Cape Town", province: "WC" },
  { name: "Durban", province: "KZN" },
  { name: "Pretoria", province: "GP" },
  { name: "Port Elizabeth", province: "EC" },
  { name: "Bloemfontein", province: "FS" },
  { name: "East London", province: "EC" },
  { name: "Umhlanga", province: "KZN" },
  { name: "Sandton", province: "GP" },
  { name: "Soweto", province: "GP" },
  { name: "Stellenbosch", province: "WC" },
  { name: "Polokwane", province: "LP" },
  { name: "Nelspruit", province: "MP" },
  { name: "Kimberley", province: "NC" },
  { name: "Durban CBD", province: "KZN" },
  { name: "Westville", province: "KZN" },
  { name: "Ballito", province: "KZN" },
  { name: "PMB", province: "KZN" },
  { name: "Berea", province: "KZN" },
] as const;

export const FEED_AREAS = ["All SA", ...POST_AREAS.map((a) => a.name)] as const;

export const SA_IDENTITIES = [
  "Blesser from Sandton",
  "Eskom Employee #7",
  "Checkers Cashier",
  "Taxi Driver from Soweto",
  "Varsity Student from UCT",
  "Braai Master from Pretoria",
  "Load Shedding Survivor",
  "Spaza Shop Owner",
  "Malva Pudding Enthusiast",
  "Stoep Philosopher",
  "Tuck Shop Legend",
  "Matric Survivor",
  "SASSA Queue Regular",
  "Data Bundle Hoarder",
  "Hungry Fool",
  "Bright Pro",
];

export const TIERS = [
  { name: "Rookie", min: 0 },
  { name: "Novice", min: 10 },
  { name: "Local", min: 50 },
  { name: "Legend", min: 150 },
  { name: "GOAT", min: 400 },
  { name: "SA Icon", min: 1000 },
] as const;

export function getProvince(area: string): string {
  const found = POST_AREAS.find((a) => a.name === area);
  if (found) return found.province;
  if (area.includes("Cape")) return "WC";
  if (area.includes("Joburg") || area.includes("Sandton") || area.includes("Soweto") || area.includes("Pretoria"))
    return "GP";
  return "KZN";
}

export function formatLocation(area: string): string {
  return `${area} · ${getProvince(area)}`;
}

export const ROTATING_PLACEHOLDERS = [
  "Eish, say what needs to be said...",
  "Yoh, what's really going on...",
  "Haibo, spill it...",
  "Ag man, just say it...",
  "Shem, the truth must be told...",
  "Eita, let it out...",
];

/** Area names for post / leaderboard chips */
export const POST_AREA_NAMES = POST_AREAS.map((a) => a.name);
