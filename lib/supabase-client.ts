import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getClientDb(): SupabaseClient | null {
  if (_client) return _client;
  // NEXT_PUBLIC_ vars are inlined by the compiler for client code
  // They must be set at build time in Vercel
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export interface ClientPost {
  id: string;
  area: string;
  category: string;
  identity: string;
  content: string;
  upvotes: number;
  comments: number;
  created_at: string;
  session_token?: string;
  upvoted_by?: string[];
  gif_url?: string;
  gif_preview?: string;
  province?: string;
  is_hot?: boolean;
  approved?: boolean;
}

export async function fetchPosts(): Promise<ClientPost[]> {
  const client = getClientDb();
  if (!client) return [];
  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as ClientPost[];
}

export async function insertPost(post: {
  id: string;
  area: string;
  category: string;
  identity: string;
  content: string;
  session_token: string;
  created_at: string;
  gif_url?: string;
  gif_preview?: string;
}): Promise<boolean> {
  const client = getClientDb();
  if (!client) return false;
  const { error } = await client.from("posts").insert({
    id: post.id,
    area: post.area,
    category: post.category,
    identity: post.identity,
    content: post.content,
    session_token: post.session_token,
    created_at: post.created_at,
    gif_url: post.gif_url || null,
    gif_preview: post.gif_preview || null,
  });
  return !error;
}

export async function upvotePostClient(postId: string, sessionToken: string): Promise<{ upvotes: number; upvoted: boolean } | null> {
  const client = getClientDb();
  if (!client) return null;

  // Get current post
  const { data: post } = await client
    .from("posts")
    .select("upvotes, upvoted_by")
    .eq("id", postId)
    .single();

  if (!post) return null;

  const upvotedBy: string[] = (post.upvoted_by as string[]) || [];
  const alreadyUpvoted = upvotedBy.includes(sessionToken);

  let newUpvotes: number;
  let newUpvotedBy: string[];

  if (alreadyUpvoted) {
    newUpvotes = Math.max(0, (post.upvotes as number) - 1);
    newUpvotedBy = upvotedBy.filter((t) => t !== sessionToken);
  } else {
    newUpvotes = (post.upvotes as number) + 1;
    newUpvotedBy = [...upvotedBy, sessionToken];
  }

  const { error } = await client
    .from("posts")
    .update({ upvotes: newUpvotes, upvoted_by: newUpvotedBy })
    .eq("id", postId);

  if (error) return null;
  return { upvotes: newUpvotes, upvoted: !alreadyUpvoted };
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const client = getClientDb();
  if (!client) return [];
  const { data } = await client
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  return (data || []) as unknown as Comment[];
}

export async function insertComment(comment: {
  id: string;
  post_id: string;
  identity: string;
  content: string;
  session_token: string;
  created_at: string;
}): Promise<boolean> {
  const client = getClientDb();
  if (!client) return false;
  const { error } = await client.from("comments").insert(comment);
  if (error) return false;
  // Increment comment count
  const { data: p } = await client
    .from("posts")
    .select("comments")
    .eq("id", comment.post_id)
    .single();
  if (p) {
    await client
      .from("posts")
      .update({ comments: (p.comments as number) + 1 })
      .eq("id", comment.post_id);
  }
  return true;
}
