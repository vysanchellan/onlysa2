"use client";

import { PageBackLink } from "@/components/onlysa/page-back-link";
import { IdentityCard } from "@/components/onlysa/identity-card";
import { JourneyModal } from "@/components/onlysa/journey-modal";
import { AppBottomNav } from "@/components/onlysa/app-bottom-nav";
import { useState, useEffect } from "react";
import { getSessionToken } from "@/lib/utils";
import type { Battle } from "@/lib/arena";
import { respondToBattle, fetchBattlesFromSupabase } from "@/lib/arena";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [incoming, setIncoming] = useState<Battle[]>([]);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseTake, setResponseTake] = useState("");
  const session = typeof window !== "undefined" ? getSessionToken() : "";

  async function loadIncoming() {
    const battles = await fetchBattlesFromSupabase();
    // Incoming = pending, no response yet, and current user is not the challenger
    const pending = battles.filter(
      (b) => b.status === "pending" && !b.challengedTake && b.challengerSession !== session
    );
    setIncoming(pending);
  }

  useEffect(() => {
    loadIncoming();
  }, [session]);

  async function handleRespond(battleId: string) {
    if (!responseTake.trim()) return;
    respondToBattle(battleId, responseTake.trim());
    setRespondingTo(null);
    setResponseTake("");
    await loadIncoming();
  }

  return (
    <>
      <div className="profile-page">
        <div className="profile-page-inner">
          <PageBackLink />

          <h1 className="profile-page-title">
            Your <span className="post-screen-accent">Profile</span>
          </h1>
          <p className="post-screen-sub">Anonymous identity & clout</p>

          <IdentityCard onOpenJourney={() => setJourneyOpen(true)} />

          {incoming.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[13px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
                Incoming Challenges ({incoming.length})
              </h2>
              {incoming.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[16px] bg-[rgba(96,165,250,0.04)] border border-[rgba(96,165,250,0.15)] p-4 mb-3"
                >
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                    Challenge from {b.challengerIdentity}
                  </div>
                  <div className="text-[13px] font-semibold text-white/80 mb-1">
                    &ldquo;{b.topic}&rdquo;
                  </div>
                  <div className="text-[11px] text-white/50 mb-3 italic">
                    {b.challengerTake}
                  </div>

                  {respondingTo === b.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={responseTake}
                        onChange={(e) => setResponseTake(e.target.value)}
                        placeholder="Your response..."
                        rows={2}
                        maxLength={300}
                        className="w-full bg-[rgba(0,0,0,0.3)] text-white text-[12px] rounded-[12px] px-3 py-2 border border-[rgba(96,165,250,0.2)] outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRespond(b.id)}
                          className="flex-1 px-3 py-2 rounded-[12px] bg-[#3B82F6] text-white text-[11px] font-bold"
                        >
                          Respond
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setRespondingTo(null); setResponseTake(""); }}
                          className="px-3 py-2 rounded-[12px] border border-white/15 text-white/50 text-[11px] font-bold"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRespondingTo(b.id)}
                      className="px-4 py-2 rounded-[12px] bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#F5A623] text-[10px] font-black tracking-wider uppercase"
                    >
                      Respond to Challenge
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <JourneyModal open={journeyOpen} onClose={() => setJourneyOpen(false)} />
      <AppBottomNav />
    </>
  );
}
