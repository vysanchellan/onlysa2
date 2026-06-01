"use client";

import { motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ParticleSphere } from "./particle-sphere";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };
const ease = [0.22, 1, 0.36, 1] as const;

interface LandingScreenProps {
  onEnter: () => void;
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  return (
    <div className="landing-screen">
      <div className="scanlines" aria-hidden />

      <div className="landing-sphere-zone">
        <ParticleSphere onClick={onEnter} />
        <div className="landing-sphere-fade" aria-hidden />
      </div>

      <div className="landing-content text-zone">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="landing-logo"
        >
          ONLYSA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="landing-separator"
          aria-hidden
        >
          — — —
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7, ease }}
          className="landing-tagline"
        >
          THE ANONYMOUS VOICE OF SOUTH AFRICA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.9 }}
          className="landing-cta-wrap"
        >
          <LiquidButton
            type="button"
            size="xl"
            onClick={onEnter}
            className="landing-enter-btn tracking-[0.18em] uppercase text-[#60A5FA] text-[13px] font-bold"
          >
            Enter the Feed
          </LiquidButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="landing-hint"
        >
          CLICK TO ENTER OR INTERACT WITH THE PARTICLES ABOVE
        </motion.p>
      </div>
    </div>
  );
}
