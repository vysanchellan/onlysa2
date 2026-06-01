"use client";

import Link from "next/link";
import { Post } from "@/types";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { timeAgo } from "@/lib/utils";
import { getProvince } from "@/lib/constants";

interface FeaturedPostStackProps {
  posts: Post[];
}

export function FeaturedPostStack({ posts }: FeaturedPostStackProps) {
  if (!posts.length) return null;

  const top = posts.slice(0, 3);

  const cards = top.map((post, index) => ({
    className:
      index === 0
        ? "[grid-area:stack] hover:-translate-y-8 transition-all duration-500"
        : index === 1
          ? "[grid-area:stack] translate-x-6 sm:translate-x-12 translate-y-5 sm:translate-y-8 hover:-translate-y-2 transition-all duration-500 opacity-90"
          : "[grid-area:stack] translate-x-12 sm:translate-x-24 translate-y-10 sm:translate-y-16 hover:translate-y-6 transition-all duration-500 opacity-80",
    username: post.identity?.startsWith("ANON") ? post.identity : "Anonymous",
    handle: `ANON · ${getProvince(post.area)}`,
    area: post.area,
    category: post.category,
    content: post.content,
    date: timeAgo(post.createdAt),
    likes: post.upvotes,
    retweets: post.comments,
    tweetUrl: `/post/${post.id}`,
  }));

  return (
    <section className="featured-stack-section">
      <div className="featured-stack-header">
        <span className="featured-label">TRANSMISSION OF THE DAY</span>
        <span className="featured-sub">Stacked voices from across SA</span>
      </div>
      <div className="featured-stack-wrap">
        <Testimonials cards={cards} />
      </div>
      {top[0] && (
        <Link href={`/post/${top[0].id}`} className="featured-read-link">
          Read full transmission
        </Link>
      )}
    </section>
  );
}
