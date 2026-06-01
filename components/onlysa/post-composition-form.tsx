"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageBackLink } from "@/components/onlysa/page-back-link";
import { POST_AREA_NAMES, ROTATING_PLACEHOLDERS } from "@/lib/constants";
import { POST_CATEGORIES } from "@/lib/post-categories";
import { getClout, getCurrentIdentity, recordPostActivity } from "@/lib/engagement";
import { getSessionToken } from "@/lib/utils";
import { GifPickerModal, type GifResult } from "@/components/onlysa/gif-picker-modal";
import { JourneyModal } from "@/components/onlysa/journey-modal";

const MAX = 500;
const spring = { type: "spring" as const, stiffness: 500, damping: 25 };

interface PostCompositionFormProps {
  onSubmitted?: () => void;
}

export function PostCompositionForm({ onSubmitted }: PostCompositionFormProps) {
  const router = useRouter();
  const [area, setArea] = useState("Joburg");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [gif, setGif] = useState<GifResult | null>(null);
  const [gifOpen, setGifOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [identity, setIdentity] = useState("Anonymous Stranger");
  const [clout, setClout] = useState(10);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [pulseArea, setPulseArea] = useState(false);
  const [pulseCategory, setPulseCategory] = useState(false);

  const category = POST_CATEGORIES.find((c) => c.id === categoryId);
  const len = content.length;
  const canSubmit =
    content.trim().length > 0 && !!area && !!categoryId && !submitting;

  useEffect(() => {
    setIdentity(getCurrentIdentity());
    setClout(getClout());
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  function flashArea() {
    setPulseArea(true);
    setTimeout(() => setPulseArea(false), 600);
  }

  function flashCategory() {
    setPulseCategory(true);
    setTimeout(() => setPulseCategory(false), 600);
  }

  async function handleSubmit() {
    if (!content.trim()) return;
    if (!area) {
      flashArea();
      return;
    }
    if (!category) {
      flashCategory();
      return;
    }
    if (content.trim().length < 10) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area,
          category: category.apiName,
          content,
          sessionToken: getSessionToken(),
          gifUrl: gif?.url,
          gifPreview: gif?.preview,
        }),
      });
      if (!res.ok) throw new Error("fail");
      recordPostActivity();
      onSubmitted?.();
      router.push("/");
    } catch {
      alert("Eskom took the servers. Again. Try once more, boet.");
    } finally {
      setSubmitting(false);
    }
  }

  let counterClass = "composition-counter";
  if (len >= 480) counterClass += " composition-counter--danger";
  else if (len >= 400) counterClass += " composition-counter--warn";

  return (
    <>
      <div className="post-screen">
        <PageBackLink />

        <h1 className="post-screen-title">
          <span className="text-white">Post </span>
          <span className="post-screen-accent">Anonymously</span>
        </h1>
        <p className="post-screen-sub">No name. No face. Just truth.</p>

        <div className="composition-card">
          <button
            type="button"
            className="composition-identity"
            onClick={() => setJourneyOpen(true)}
          >
            <div className="composition-identity-avatar">
              <span>{identity.charAt(0).toUpperCase()}</span>
            </div>
            <div className="composition-identity-meta">
              <div className="composition-identity-label">Posting as</div>
              <div className="composition-identity-name">{identity}</div>
            </div>
            <div className="composition-identity-clout">
              <div className="composition-identity-label">Clout</div>
              <div className="composition-identity-score">{clout}</div>
            </div>
          </button>

          <div className="composition-textarea-wrap">
            <textarea
              className="composition-textarea"
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= MAX) setContent(e.target.value);
              }}
              placeholder={
                placeholderVisible ? ROTATING_PLACEHOLDERS[placeholderIdx] : ""
              }
              rows={5}
            />
            <span className={counterClass}>
              {len} / {MAX}
            </span>
          </div>

          <button
            type="button"
            className="composition-add-gif"
            onClick={() => setGifOpen(true)}
          >
            + Add GIF
          </button>

          {gif && (
            <div className="composition-gif-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gif.preview || gif.url} alt="Selected GIF" />
              <button
                type="button"
                className="composition-gif-remove"
                onClick={() => setGif(null)}
                aria-label="Remove GIF"
              >
                ×
              </button>
            </div>
          )}

          <div className="composition-divider" />

          <div className="composition-section">
            <div
              className={`composition-section-label ${pulseArea ? "composition-section-label--pulse" : ""}`}
            >
              Area
            </div>
            <div className="composition-chips-scroll">
              {POST_AREA_NAMES.map((name) => (
                <motion.button
                  key={name}
                  type="button"
                  onClick={() => setArea(name)}
                  whileTap={{ scale: 0.95 }}
                  animate={area === name ? { scale: 1.04 } : { scale: 1 }}
                  transition={spring}
                  className={`composition-area-chip ${area === name ? "composition-area-chip--selected" : ""}`}
                >
                  {name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="composition-section composition-section--category">
            <div
              className={`composition-section-label ${pulseCategory ? "composition-section-label--pulse" : ""}`}
            >
              Category
            </div>
            <div className="composition-category-grid">
              {POST_CATEGORIES.map((cat) => {
                const active = categoryId === cat.id;
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    whileTap={{ scale: 0.94 }}
                    animate={active ? { scale: 1.03 } : { scale: 1 }}
                    transition={spring}
                    className={`composition-category-btn ${active ? "composition-category-btn--active" : ""}`}
                    style={
                      active
                        ? {
                            background: cat.bg,
                            borderColor: cat.color,
                            boxShadow: `0 0 20px ${cat.glow}`,
                          }
                        : undefined
                    }
                  >
                    {active && (
                      <motion.div
                        layoutId="category-indicator"
                        className="composition-category-dot"
                        style={{ background: cat.color }}
                      />
                    )}
                    <Icon
                      size={16}
                      color={active ? cat.color : "rgba(255,255,255,0.35)"}
                    />
                    <span
                      className="composition-category-label"
                      style={active ? { color: cat.color } : undefined}
                    >
                      {cat.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            transition={spring}
            className={`composition-submit ${canSubmit ? "composition-submit--ready" : ""}`}
          >
            {submitting ? "Transmitting..." : "Drop It"}
          </motion.button>
        </div>
      </div>

      <GifPickerModal
        open={gifOpen}
        onClose={() => setGifOpen(false)}
        onSelect={setGif}
      />

      <JourneyModal open={journeyOpen} onClose={() => setJourneyOpen(false)} />
    </>
  );
}
