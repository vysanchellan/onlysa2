"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle } from "lucide-react";
import { BATTLE_TOPICS, createBattle } from "@/lib/arena";

interface ChallengeModalProps {
  open: boolean;
  onClose: () => void;
  challengedIdentity: string;
}

export function ChallengeModal({ open, onClose, challengedIdentity }: ChallengeModalProps) {
  const [topic, setTopic] = useState(BATTLE_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [take, setTake] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTopic(BATTLE_TOPICS[0]);
      setCustomTopic("");
      setUseCustom(false);
      setTake("");
      setSuccess(false);
    }
  }, [open]);

  const spin = () => {
    if (spinning) return;
    setUseCustom(false);
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setTopic(BATTLE_TOPICS[Math.floor(Math.random() * BATTLE_TOPICS.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 80);
  };

  const handleSubmit = async () => {
    const finalTopic = useCustom ? customTopic.trim() : topic;
    if (!finalTopic || !take.trim()) return;
    setSubmitting(true);
    try {
      createBattle(challengedIdentity, finalTopic, take.trim());
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-[210] rounded-[24px_24px_0_0] bg-[#111] border-t border-white/10 p-6 pb-10 max-h-[85vh] overflow-y-auto"
            style={{ maxWidth: "500px", margin: "0 auto" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[11px] text-white/35 uppercase tracking-widest">Challenge</div>
                <div className="text-[13px] text-white/70 font-semibold mt-0.5">
                  You vs <span className="text-[#FF6B6B]">{challengedIdentity}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/40"
              >
                <X size={16} />
              </button>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="text-[#34D399] text-[28px] font-black mb-2">Challenge Sent!</div>
                <div className="text-[13px] text-white/40">{challengedIdentity} has 2 hours to respond.</div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="text-[10px] text-white/35 uppercase tracking-widest mb-2">Choose Your Topic</div>
                  <div className="flex gap-2">
                    <button
                      onClick={spin}
                      disabled={spinning}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-white/60 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      <Shuffle size={12} />
                      {spinning ? "Spinning..." : "Spin the wheel"}
                    </button>
                    <button
                      onClick={() => setUseCustom(!useCustom)}
                      className={`px-4 py-2 rounded-full border text-[11px] font-semibold transition-all ${useCustom ? "bg-[#60A5FA]/20 border-[#60A5FA]/40 text-[#60A5FA]" : "border-white/10 text-white/50 hover:bg-white/5"}`}
                    >
                      Write your own
                    </button>
                  </div>
                </div>

                {useCustom ? (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value.slice(0, 60))}
                    placeholder="Type your topic..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#60A5FA]/40 mb-4"
                    maxLength={60}
                  />
                ) : (
                  <div className={`px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-4 text-sm ${spinning ? "text-[#60A5FA]" : "text-white/80"}`}>
                    {topic}
                  </div>
                )}

                <div className="mb-2">
                  <div className="text-[10px] text-white/35 uppercase tracking-widest mb-2">Your Take (280 chars max)</div>
                  <textarea
                    ref={inputRef}
                    value={take}
                    onChange={(e) => setTake(e.target.value.slice(0, 280))}
                    placeholder="Write your opening argument..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF6B6B]/40 resize-none"
                  />
                  <div className="text-right text-[10px] text-white/25 mt-1 font-mono">{280 - take.length}</div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!take.trim() || submitting || (!useCustom && !topic) || (useCustom && !customTopic.trim())}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#E63946] text-white text-[12px] font-black tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-[#FF6B6B]/20"
                >
                  {submitting ? "Sending..." : "Send the Challenge"}
                </button>
                <div className="text-center text-[10px] text-white/25 mt-2">They have 2 hours to respond</div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
