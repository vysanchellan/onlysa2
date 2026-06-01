"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpiralAnimation } from "@/components/ui/spiral-animation";

interface DimensionTransitionProps {
  active: boolean;
  onComplete?: () => void;
  label?: string;
}

export function DimensionTransition({
  active,
  onComplete,
  label = "Entering transmission layer",
}: DimensionTransitionProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(t);
  }, [active, onComplete, mounted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="dimension-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <SpiralAnimation />
          <p className="dimension-label">{label}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
