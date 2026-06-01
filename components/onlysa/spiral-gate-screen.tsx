"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { GatePreviewStack } from "./gate-preview-stack";
import { Post } from "@/types";

const DottedSurface = dynamic(
  () =>
    import("@/components/ui/dotted-surface").then((m) => ({
      default: m.DottedSurface,
    })),
  { ssr: false }
);

interface SpiralGateScreenProps {
  onEnter: () => void;
  posts: Post[];
}

export function SpiralGateScreen({ onEnter, posts }: SpiralGateScreenProps) {
  const [ctaVisible, setCtaVisible] = useState(false);

  const previewPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    if (sorted.length >= 3) return sorted.slice(0, 3);
    return sorted;
  }, [posts]);

  useEffect(() => {
    const t = setTimeout(() => setCtaVisible(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="spiral-gate-screen">
      <DottedSurface fillContainer theme="dark" className="spiral-gate-dots" />

      <div className="spiral-gate-ambient" aria-hidden />
      <div className="spiral-gate-vignette" aria-hidden />

      <div className="spiral-gate-grid">
        <div className="spiral-gate-body">
          <motion.aside
            className="spiral-gate-stack-col"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.85 }}
          >
            <p className="spiral-stack-eyebrow">What SA is saying</p>
            <span className="dual-stack-label">Trending now</span>
            <p className="spiral-stack-hint">Tap or hover the cards</p>
            <GatePreviewStack posts={previewPosts} />
          </motion.aside>

          <div className="spiral-gate-enter-col">
            <motion.header
              className="spiral-gate-header-inline"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="spiral-gate-logo">ONLYSA</h1>
              <p className="spiral-gate-tagline">
                The anonymous voice of South Africa
              </p>
            </motion.header>

            <motion.div
              className="spiral-gate-enter-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: ctaVisible ? 1 : 0, y: ctaVisible ? 0 : 16 }}
              transition={{ duration: 1 }}
            >
              <button
                type="button"
                onClick={onEnter}
                className="spiral-enter-text"
              >
                Enter
              </button>
              <p className="spiral-enter-sub">Tap to open the feed</p>

              <LiquidButton
                type="button"
                size="xl"
                onClick={onEnter}
                className="spiral-liquid-cta landing-enter-btn"
              >
                Enter the Feed
              </LiquidButton>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
