import React from "react";
import { motion } from "framer-motion";
import { RiSparkling2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Reels = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[100dvh] px-4 pb-10 pt-20">
      <div className="fixed top-0 z-40 w-full border-b border-white/10 bg-[rgba(var(--panel)/0.55)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
            onClick={() => navigate("/")}
            aria-label="Back"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <div>
            <div className="text-base font-semibold text-[rgb(var(--text))]">Reels</div>
            <div className="text-xs text-[rgb(var(--muted))]">A premium canvas for short moments.</div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.55)] p-7 shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute -top-24 -right-10 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary)/0.65),transparent_60%)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-12 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_100%_100%,rgba(var(--accent)/0.55),transparent_60%)] blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-[rgb(var(--muted))]">
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: [0, 8, 0, -6, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(0,0,0,0.45)] text-[rgb(var(--primary))]"
                >
                  <RiSparkling2Line />
                </motion.span>
                <span>Coming soon</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--text))] md:text-3xl">
                Reels, reimagined.
              </h2>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                We’re building a calm, premium reel experience with buttery motion, clean controls, and
                zero distraction.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/messages")}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] px-4 py-2 text-xs font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.55)] hover:brightness-110 active:scale-95"
              >
                Open Messages
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
              >
                Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reels;
