import { Post, Comment } from "@/types";
import { SEED_POSTS } from "./seed-data";

// In-memory store (resets on server restart — use a DB for production)
let posts: Post[] = [...SEED_POSTS];
let comments: Comment[] = [];

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getTrendingPosts(): Post[] {
  return [...posts].sort((a, b) => b.upvotes - a.upvotes);
}

export function getTopRatedPosts(): Post[] {
  return [...posts]
    .filter((p) => p.category === "Review")
    .sort((a, b) => b.upvotes - a.upvotes);
}

export function getPostsByArea(area: string): Post[] {
  if (area === "All SA") return getAllPosts();
  return getAllPosts().filter((p) => p.area === area);
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function createPost(
  post: Omit<Post, "id" | "upvotes" | "comments" | "upvotedBy">
): Post {
  const newPost: Post = {
    ...post,
    id: crypto.randomUUID(),
    upvotes: 0,
    comments: 0,
    upvotedBy: [],
  };
  posts = [newPost, ...posts];
  return newPost;
}

export function upvotePost(
  postId: string,
  sessionToken: string
): Post | undefined {
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx === -1) return undefined;

  const post = { ...posts[idx] };
  const upvotedBy = post.upvotedBy || [];

  if (upvotedBy.includes(sessionToken)) {
    post.upvotes = Math.max(0, post.upvotes - 1);
    post.upvotedBy = upvotedBy.filter((t) => t !== sessionToken);
  } else {
    post.upvotes += 1;
    post.upvotedBy = [...upvotedBy, sessionToken];
  }

  posts[idx] = post;
  return post;
}

export function getCommentsByPost(postId: string): Comment[] {
  return comments
    .filter((c) => c.postId === postId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function createComment(
  comment: Omit<Comment, "id">
): Comment {
  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
  };
  comments = [...comments, newComment];

  // Update comment count
  const postIdx = posts.findIndex((p) => p.id === comment.postId);
  if (postIdx !== -1) {
    posts[postIdx] = {
      ...posts[postIdx],
      comments: posts[postIdx].comments + 1,
    };
  }

  return newComment;
}
