import { motion } from "framer-motion";

export function TypingIndicator({ label = "Typing…" }) {
  return (
    <div className="px-3 pb-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(var(--panel)/0.6)] px-3 py-1.5 text-xs text-[rgb(var(--muted))] backdrop-blur">
        <span className="max-w-[220px] truncate">{label}</span>
        <span className="inline-flex items-center gap-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--muted))]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--muted))]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--muted))]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
          />
        </span>
      </div>
    </div>
  );
}

