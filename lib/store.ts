import { Post, Comment } from "@/types";
import { SEED_POSTS } from "./seed-data";
import { getSupabase } from "./supabase";

let postsCache: Post[] = [...SEED_POSTS];
let commentsCache: Comment[] = [];

function db() {
  return getSupabase();
}

function mapPost(d: Record<string, unknown>): Post {
  return {
    id: d.id as string,
    area: d.area as string,
    category: d.category as string,
    identity: d.identity as string,
    content: d.content as string,
    upvotes: (d.upvotes as number) ?? 0,
    comments: (d.comments as number) ?? 0,
    createdAt: d.created_at as string,
    sessionToken: (d.session_token as string) || undefined,
    upvotedBy: (d.upvoted_by as string[]) || [],
    gifUrl: (d.gif_url as string) || undefined,
    gifPreview: (d.gif_preview as string) || undefined,
    province: (d.province as string) || undefined,
    isHot: (d.is_hot as boolean) ?? false,
    approved: (d.approved as boolean) ?? true,
  };
}

function mapComment(d: Record<string, unknown>): Comment {
  return {
    id: d.id as string,
    postId: d.post_id as string,
    identity: d.identity as string,
    content: d.content as string,
    createdAt: d.created_at as string,
    sessionToken: (d.session_token as string) || undefined,
  };
}

async function loadPosts(): Promise<Post[]> {
  const client = db();
  if (client) {
    const { data, error } = await client
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data?.length) {
      postsCache = data.map(mapPost);
    }
  }
  return postsCache;
}

export async function getAllPosts(): Promise<Post[]> {
  return loadPosts();
}

export async function getTrendingPosts(): Promise<Post[]> {
  const all = await loadPosts();
  return [...all].sort((a, b) => b.upvotes - a.upvotes);
}

export async function getTopRatedPosts(): Promise<Post[]> {
  const all = await loadPosts();
  return [...all]
    .filter((p) => p.category === "Review")
    .sort((a, b) => b.upvotes - a.upvotes);
}

export async function getPostsByArea(area: string): Promise<Post[]> {
  const all = await loadPosts();
  if (area === "All SA") return all;
  return all.filter((p) => p.area === area);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const client = db();
  if (client) {
    const { data } = await client.from("posts").select("*").eq("id", id).single();
    if (data) return mapPost(data);
  }
  const all = await loadPosts();
  return all.find((p) => p.id === id);
}

export async function createPost(
  input: Omit<Post, "id" | "upvotes" | "comments" | "upvotedBy">
): Promise<Post> {
  const post: Post = {
    ...input,
    id: crypto.randomUUID(),
    upvotes: 0,
    comments: 0,
    upvotedBy: [],
  };

  const client = db();
  if (client) {
    await client.from("posts").insert({
      id: post.id,
      area: post.area,
      category: post.category,
      identity: post.identity,
      content: post.content,
      session_token: post.sessionToken || "",
      gif_url: post.gifUrl || null,
      gif_preview: post.gifPreview || null,
      province: post.province || null,
      is_hot: post.isHot || false,
      approved: post.approved ?? true,
      created_at: post.createdAt,
    });
  }

  postsCache = [post, ...postsCache];
  return post;
}

export async function upvotePost(
  postId: string,
  sessionToken: string
): Promise<Post | undefined> {
  const all = await loadPosts();
  const idx = all.findIndex((p) => p.id === postId);
  if (idx === -1) return undefined;

  const post = { ...all[idx] };
  const upvotedBy = post.upvotedBy || [];

  let newUpvotes: number;
  let newUpvotedBy: string[];

  if (upvotedBy.includes(sessionToken)) {
    newUpvotes = Math.max(0, post.upvotes - 1);
    newUpvotedBy = upvotedBy.filter((t) => t !== sessionToken);
  } else {
    newUpvotes = post.upvotes + 1;
    newUpvotedBy = [...upvotedBy, sessionToken];
  }

  const client = db();
  if (client) {
    await client
      .from("posts")
      .update({ upvotes: newUpvotes, upvoted_by: newUpvotedBy })
      .eq("id", postId);
  }

  post.upvotes = newUpvotes;
  post.upvotedBy = newUpvotedBy;
  postsCache[idx] = post;
  return post;
}

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const client = db();
  if (client) {
    const { data } = await client
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) {
      commentsCache = data.map(mapComment);
      return commentsCache;
    }
  }
  return commentsCache
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(
  input: Omit<Comment, "id">
): Promise<Comment> {
  const comment: Comment = { ...input, id: crypto.randomUUID() };

  const client = db();
  if (client) {
    await client.from("comments").insert({
      id: comment.id,
      post_id: comment.postId,
      identity: comment.identity,
      content: comment.content,
      session_token: comment.sessionToken || "",
      created_at: comment.createdAt,
    });
    // Increment comment count on the post
    const { data: p } = await client
      .from("posts")
      .select("comments")
      .eq("id", comment.postId)
      .single();
    if (p) {
      await client
        .from("posts")
        .update({ comments: (p.comments as number) + 1 })
        .eq("id", comment.postId);
    }
  }

  commentsCache = [...commentsCache, comment];
  const postIdx = postsCache.findIndex((p) => p.id === comment.postId);
  if (postIdx !== -1) {
    postsCache[postIdx] = {
      ...postsCache[postIdx],
      comments: postsCache[postIdx].comments + 1,
    };
  }

  return comment;
}
