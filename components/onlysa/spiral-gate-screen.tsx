"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
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
  const previewPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    if (sorted.length >= 3) return sorted.slice(0, 3);
    return sorted;
  }, [posts]);

  return (
    <div className="spiral-gate-screen">
      <DottedSurface fillContainer theme="dark" className="spiral-gate-dots" />

      <div className="spiral-gate-ambient" aria-hidden />
      <div className="spiral-gate-vignette" aria-hidden />

      <div className="spiral-gate-grid">
        <div className="spiral-gate-body">
          <motion.aside
            className="spiral-gate-stack-col max-md:hidden"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.85 }}
          >
            <motion.p
              className="spiral-gate-arena-label"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              The Arena
            </motion.p>
            <motion.p
              className="spiral-gate-arena-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              Anonymous battles rage across SA
            </motion.p>
            <GatePreviewStack posts={previewPosts} />
          </motion.aside>

          <div className="spiral-gate-enter-col">
            <motion.header
              className="spiral-gate-header-inline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="spiral-gate-logo">ONLYSA</h1>
              <p className="spiral-gate-tagline">
                The anonymous voice of South Africa
              </p>
            </motion.header>

            <motion.div
              className="spiral-gate-separator"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="md:hidden w-full flex flex-col items-center gap-2">
              <p className="spiral-gate-arena-label">The Arena</p>
              <p className="spiral-gate-arena-desc">Anonymous battles rage across SA</p>
              <GatePreviewStack posts={previewPosts} />
            </div>

            <motion.p
              className="spiral-gate-battle-tease"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Take Battles boil. The Throne shifts. Co-sign or cross.
              <br />
              <span className="text-[rgba(255,255,255,0.25)]">Anonymous. Unfiltered. Yours.</span>
            </motion.p>

            <motion.div
              className="spiral-gate-enter-block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
            >
              <motion.button
                type="button"
                onClick={onEnter}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 60px rgba(96,165,250,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="ngena-btn"
              >
                NGENA
              </motion.button>
              <p className="ngena-whisper">
                ngena — enter · come in · isiZulu
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
