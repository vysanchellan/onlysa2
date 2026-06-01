"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, ArrowUp, MessageCircle, Loader2, Send, Flame } from "lucide-react";
import { Post, Comment } from "@/types";
import { timeAgo, getSessionToken } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/constants";

const CategoryBadge = ({ category }: { category: string }) => {
  const cat = CATEGORY_STYLES[category] ?? CATEGORY_STYLES["Hot Take"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase"
      style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}44` }}
    >
      {cat.label}
    </span>
  );
};

const AreaTag = ({ area }: { area: string }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-text-secondary bg-white/5 border border-white/10">
    {area}
  </span>
);

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch(`/api/posts/${id}/comments`),
        ]);

        if (!postRes.ok) {
          setNotFound(true);
          return;
        }

        const postData = await postRes.json();
        const commentsData = commentsRes.ok ? await commentsRes.json() : { comments: [] };

        setPost(postData.post);
        setUpvotes(postData.post.upvotes);
        setComments(commentsData.comments);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleUpvote() {
    const session = getSessionToken();
    setUpvoted((prev) => !prev);
    setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/posts/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: session }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setUpvoted(data.upvoted);
      }
    } catch {
      setUpvoted((prev) => !prev);
      setUpvotes((prev) => (upvoted ? prev + 1 : prev - 1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || submitting) return;

    setSubmitting(true);
    const session = getSessionToken();

    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment.trim(),
          sessionToken: session,
          area: post?.area || "All SA",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setComment("");
      }
    } catch {
      // handle
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    const text = `Check this on OnlySA: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={24} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-6xl mb-4">🌵</p>
          <p className="text-text-secondary font-mono text-sm mb-4">Post not found.</p>
          <Link href="/" className="text-accent-red text-sm font-mono hover:underline">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const isHot = post.upvotes > 100 || post.isHot;

  return (
    <div className="min-h-screen bg-bg" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.06), transparent 60%)" }}>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-base font-display tracking-wider">
            Only<span className="text-accent-red">SA</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            {isHot && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-accent-red uppercase tracking-wider bg-accent-red/10 px-2 py-0.5 rounded-full border border-accent-red/20">
                <Flame size={10} />
                Hot
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-32 sm:pb-12">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-accent-red/20 via-accent-blue/10 to-transparent rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          <article className="relative bg-bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-red/40 to-transparent rounded-t-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CategoryBadge category={post.category} />
              <AreaTag area={post.area} />
              <span className="ml-auto text-[11px] font-mono text-text-muted/60">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <p className="text-text-primary text-base sm:text-lg leading-relaxed mb-4 font-light">
              {post.content}
            </p>

            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center text-[10px] font-bold text-white">
                {post.identity?.charAt(0) || "?"}
              </div>
              <span className="text-[12px] font-mono text-text-muted uppercase tracking-wider">
                {post.identity}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border/40">
              <button
                onClick={handleUpvote}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  upvoted
                    ? "text-accent-red bg-accent-red/10 border border-accent-red/30 shadow-[0_0_12px_rgba(230,57,70,0.15)]"
                    : "text-text-muted bg-white/5 hover:bg-white/10 hover:text-text-primary border border-white/10"
                )}
              >
                <ArrowUp size={15} className={upvoted ? "animate-bounce-once" : ""} />
                <span className="font-mono text-xs">{upvotes}</span>
              </button>

              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-muted bg-white/5 border border-white/10">
                <MessageCircle size={15} />
                <span className="font-mono text-xs">{comments.length}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-muted bg-white/5 border border-white/10 hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all ml-auto"
              >
                <Share2 size={15} />
                <span className="text-xs hidden sm:inline">Share</span>
              </button>
            </div>
          </article>
        </div>

        {/* Comments section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
            <h2 className="text-[11px] font-mono text-text-muted/60 uppercase tracking-wider">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-border/60 to-transparent" />
          </div>

          {/* Comment input */}
          <form onSubmit={handleComment} className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-accent-blue/20 to-transparent rounded-2xl blur-lg opacity-40 pointer-events-none" />
            <div className="relative bg-bg-card/90 backdrop-blur-xl border border-border/60 rounded-xl p-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 300))}
                placeholder="Add your take..."
                rows={3}
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted/40 text-sm leading-relaxed resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <span className="text-[11px] font-mono text-text-muted/50">
                  Anonymous &middot; {300 - comment.length} chars
                </span>
                <button
                  type="submit"
                  disabled={!comment.trim() || submitting}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    comment.trim()
                      ? "bg-accent-red text-white hover:bg-accent-red/90 shadow-[0_0_12px_rgba(230,57,70,0.2)]"
                      : "bg-white/5 text-text-muted/40 cursor-not-allowed"
                  )}
                >
                  {submitting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                  <span className="hidden sm:inline">Comment Anonymously</span>
                </button>
              </div>
            </div>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <MessageCircle size={18} className="text-text-muted/40" />
              </div>
              <p className="text-[12px] font-mono text-text-muted/50">
                No comments yet. Be the first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-bg-card/80 backdrop-blur-lg border border-border/40 rounded-xl px-4 py-3 hover:border-border/60 transition-all"
                  style={{
                    animation: `slideUp 0.3s ease ${i * 0.05}s both`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-text-muted">
                      {c.identity?.charAt(0) || "?"}
                    </div>
                    <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                      {c.identity}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted/30 ml-auto">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed pl-7">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
