import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./theme/ThemeProvider.jsx";

export function IntroShell({ children }) {
  const [showIntro, setShowIntro] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(14px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(126,231,255,0.16),transparent_60%),radial-gradient(circle_at_100%_10%,rgba(198,129,255,0.18),transparent_60%),linear-gradient(145deg,rgb(5,8,20),rgb(10,12,24))]"
          >
            <div className="pointer-events-none absolute inset-[-10%] opacity-[0.15] mix-blend-soft-light [background-image:url('https://grainy-gradients.vercel.app/noise.svg')] [background-size:220px_220px]" />

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 18 }}
              className="relative z-10 flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-white/8 bg-[rgba(6,10,24,0.82)] px-8 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                className="mb-1 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_0%_0%,rgba(126,231,255,0.95),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(198,129,255,0.95),transparent_55%)] shadow-[0_18px_50px_rgba(0,0,0,0.7)]"
              >
                <span className="text-2xl font-semibold text-black">C</span>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                  },
                }}
              >
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--muted))]"
                >
                  Welcome to
                </motion.p>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--accent))] to-[rgb(var(--primary))] bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-[40px]"
                >
                  Convo
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-sm font-medium text-[rgb(var(--text))]"
                >
                  Premium messaging, built for focus.
                </motion.p>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="mx-auto max-w-md text-xs text-[rgb(var(--muted))]"
                >
                  Glassy UI, smooth transitions, and a calm{" "}
                  <span className="font-medium">
                    {theme === "light" ? "light" : "dark"} theme
                  </span>{" "}
                  by default — with {theme === "dark" ? "a light mode" : "a dark mode"} when
                  you want it.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-2 text-[11px] text-[rgb(var(--muted))]"
              >
                Developed by <span className="font-medium text-[rgb(var(--text))]">Dipanshu Kale</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={showIntro ? "pointer-events-none opacity-0" : "opacity-100 transition-opacity duration-400"}>
        {children}
      </div>
    </>
  );
}

