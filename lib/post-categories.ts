import {
  Flame,
  Lock,
  Zap,
  HelpCircle,
  Star,
  Eye,
  type LucideIcon,
} from "lucide-react";

export interface PostCategoryDef {
  id: string;
  label: string;
  apiName: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  glow: string;
}

export const POST_CATEGORIES: PostCategoryDef[] = [
  {
    id: "rant",
    label: "Rant",
    apiName: "Rant",
    icon: Flame,
    color: "#FF6B6B",
    bg: "rgba(255,107,107,0.08)",
    glow: "rgba(255,107,107,0.2)",
  },
  {
    id: "confession",
    label: "Confession",
    apiName: "Confession",
    icon: Lock,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    glow: "rgba(167,139,250,0.2)",
  },
  {
    id: "hot-take",
    label: "Hot Take",
    apiName: "Hot Take",
    icon: Zap,
    color: "#F5A623",
    bg: "rgba(245,166,35,0.08)",
    glow: "rgba(245,166,35,0.2)",
  },
  {
    id: "question",
    label: "Question",
    apiName: "Question",
    icon: HelpCircle,
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    glow: "rgba(96,165,250,0.2)",
  },
  {
    id: "review",
    label: "Review",
    apiName: "Review",
    icon: Star,
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    glow: "rgba(52,211,153,0.2)",
  },
  {
    id: "neighbourhood",
    label: "Neighbourhood",
    apiName: "Neighbourhood Watch",
    icon: Eye,
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    glow: "rgba(251,191,36,0.2)",
  },
];

export function categoryByApiName(apiName: string): PostCategoryDef | undefined {
  return POST_CATEGORIES.find((c) => c.apiName === apiName);
}
