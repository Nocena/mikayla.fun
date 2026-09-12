import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";

export default function AgeVerificationModal({ onVerified }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("mika_age_verified");
    if (verified !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("mika_age_verified", "true");
    setIsOpen(false);
    if (onVerified) onVerified();
  };

  const handleDecline = () => {
    window.location.href = "https://google.com";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d0e12]/95 p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[#d4fc50]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* 18+ Icon Badge */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-inner">
              <span className="text-3xl font-black tracking-wider">18+</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-neutral-300 uppercase mb-3">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Age Verification Required</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Adults-Only Portal
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              This staking vault and member sanctuary grants access to unfiltered, private creator archives and exclusive media packages produced by verified partner creators.
            </p>

            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-neutral-400">
              By entering, you certify that you are at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction) and consent to viewing mature content.
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <button
                onClick={handleConfirm}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d4fc50] px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-[#d4fc50]/20 transition-all hover:bg-[#c2ea3f] hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle className="h-4 w-4" />
                <span>I Am 18+ — Enter Portal</span>
              </button>
              <button
                onClick={handleDecline}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-neutral-300 transition-all hover:bg-white/10 hover:text-white"
              >
                <XCircle className="h-4 w-4 text-neutral-400" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
