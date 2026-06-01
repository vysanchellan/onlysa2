export interface Post {
  id: string;
  area: string;
  category: string;
  identity: string;
  content: string;
  upvotes: number;
  comments: number;
  createdAt: string;
  sessionToken?: string;
  upvotedBy?: string[];
  gifUrl?: string;
  gifPreview?: string;
  province?: string;
  isHot?: boolean;
  approved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  identity: string;
  content: string;
  createdAt: string;
  sessionToken?: string;
}

export interface ModerationResult {
  approved: boolean;
  reason: string;
  category_suggestion: string;
}
