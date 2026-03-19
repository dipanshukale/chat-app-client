import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const toastVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeoutsRef.current.get(id);
    if (handle) clearTimeout(handle);
    timeoutsRef.current.delete(id);
  }, []);

  const push = useCallback(
    ({ title, message, kind = "info", durationMs = 3200 } = {}) => {
      const id = makeId();
      const toast = { id, title, message, kind };
      setToasts((prev) => [toast, ...prev].slice(0, 5));

      const handle = setTimeout(() => remove(id), durationMs);
      timeoutsRef.current.set(id, handle);
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] w-[min(92vw,380px)] space-y-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
              className={[
                "relative overflow-hidden rounded-2xl border px-4 py-3 shadow-xl",
                "backdrop-blur-xl bg-[rgba(var(--panel)/0.55)] border-white/10",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute inset-x-0 top-0 h-[2px]",
                  t.kind === "success"
                    ? "bg-[rgb(var(--primary))]"
                    : t.kind === "error"
                      ? "bg-[rgb(var(--danger))]"
                      : "bg-[rgb(var(--accent))]",
                ].join(" ")}
              />
              <button
                onClick={() => remove(t.id)}
                className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] hover:bg-white/5"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
              {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
              {t.message ? (
                <div className="mt-0.5 text-sm text-[rgb(var(--muted))]">{t.message}</div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

