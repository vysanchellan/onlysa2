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
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <div className="text-[10px] font-[700] tracking-[0.25em] text-[rgba(255,255,255,0.35)] uppercase mb-1">
                What SA is saying
              </div>
              <div className="text-[13px] font-[500] text-[rgba(255,255,255,0.5)] leading-snug">
                Rants. Hot takes. Confessions. Reviews.
              </div>
            </motion.div>
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

            <div className="md:hidden w-full flex flex-col items-center gap-3">
              <div className="text-center">
                <div className="text-[10px] font-[700] tracking-[0.25em] text-[rgba(255,255,255,0.35)] uppercase mb-1">
                  What SA is saying
                </div>
                <div className="text-[13px] font-[500] text-[rgba(255,255,255,0.5)] leading-snug">
                  Rants. Hot takes. Confessions. Reviews.
                </div>
              </div>
              <GatePreviewStack posts={previewPosts} />
            </div>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[13px] text-[rgba(255,255,255,0.45)] leading-[1.7] tracking-wide max-w-[340px]">
                Post anything. No name attached. No face exposed.<br />
                Just your raw, unfiltered South African voice.
              </p>

              <div className="flex items-start gap-3 pl-3 border-l border-[rgba(96,165,250,0.25)]">
                <div>
                  <div className="text-[10px] font-[700] tracking-[0.2em] uppercase text-[#60A5FA] mb-0.5">
                    The Arena
                  </div>
                  <div className="text-[12px] text-[rgba(255,255,255,0.35)] leading-snug">
                    Challenge anyone. Take Battles. The Throne. Co-sign or cross.
                  </div>
                </div>
              </div>
            </motion.div>

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
                anonymous · unfiltered · yours
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
