"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";

export interface GifResult {
  url: string;
  preview: string;
}

interface GifPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (gif: GifResult) => void;
}

export function GifPickerModal({ open, onClose, onSelect }: GifPickerModalProps) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGifs = useCallback(async (q: string) => {
    const key = process.env.NEXT_PUBLIC_TENOR_API_KEY;
    if (!key) {
      setGifs([]);
      return;
    }
    setLoading(true);
    try {
      const endpoint = q.trim()
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${key}&limit=16`
        : `https://tenor.googleapis.com/v2/featured?key=${key}&limit=16`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const results: GifResult[] = (data.results ?? []).map(
        (r: {
          media_formats: { gif?: { url: string }; tinygif?: { url: string } };
        }) => ({
          url: r.media_formats?.gif?.url ?? "",
          preview: r.media_formats?.tinygif?.url ?? r.media_formats?.gif?.url ?? "",
        })
      );
      setGifs(results.filter((g: GifResult) => g.url));
    } catch {
      setGifs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => fetchGifs(query), query ? 300 : 0);
    return () => clearTimeout(t);
  }, [open, query, fetchGifs]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="gif-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="gif-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="gif-modal-header">
              <div className="gif-search">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search GIFs..."
                />
              </div>
              <button type="button" onClick={onClose} className="gif-close" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <p className="gif-section-label">{query ? "RESULTS" : "TRENDING"}</p>

            {!process.env.NEXT_PUBLIC_TENOR_API_KEY && (
              <p className="gif-empty">
                Add <code>NEXT_PUBLIC_TENOR_API_KEY</code> to .env.local for GIF search.
              </p>
            )}

            {loading && <p className="gif-empty">Eish, loading...</p>}

            <div className="gif-grid">
              {gifs.map((g) => (
                <button
                  key={g.url}
                  type="button"
                  className="gif-thumb"
                  onClick={() => {
                    onSelect(g);
                    onClose();
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.preview} alt="" />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
