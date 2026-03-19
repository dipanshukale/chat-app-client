import React from "react";
import { motion } from "framer-motion";
import { RiChatSmile3Line } from "react-icons/ri";

export function ConvoMark({ size = 18, className = "", showSpark = true }) {
  return (
    <motion.span
      aria-hidden="true"
      className={[
        "relative inline-flex items-center justify-center",
        "rounded-2xl border border-white/10",
        "bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary)/0.95),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(var(--accent)/0.92),transparent_55%)]",
        "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
      style={{ width: size * 2.2, height: size * 2.2 }}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <motion.span
        className="absolute inset-0 rounded-2xl opacity-70"
        animate={{ filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.span
        className="relative inline-flex items-center justify-center text-black"
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <RiChatSmile3Line style={{ width: size, height: size }} />
      </motion.span>

      {showSpark ? (
        <motion.span
          className="pointer-events-none absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-white/80"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0.2], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
        />
      ) : null}
    </motion.span>
  );
}

