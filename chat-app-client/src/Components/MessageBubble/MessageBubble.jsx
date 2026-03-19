import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiCheckCircle } from "react-icons/fi";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function DeliveryTicks({ status }) {
  // status can be: "sent" | "delivered" | "seen" (best-effort)
  if (!status) return null;
  if (status === "seen") return <FiCheckCircle className="opacity-90" />;
  if (status === "delivered") return <FiCheck className="opacity-90" />;
  return <FiCheck className="opacity-60" />;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  showMeta = true,
}) {
  const time = useMemo(
    () => formatTime(message?.createdAt || message?.timestamp || message?.time),
    [message]
  );

  const status = message?.seen ? "seen" : message?.delivered ? "delivered" : "sent";

  const bubbleBase =
    "max-w-[78%] md:max-w-[64%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ring-1 ring-white/10";

  const ownBubble =
    "bg-gradient-to-br from-[rgba(var(--primary)/0.55)] to-[rgba(var(--accent)/0.35)] text-[rgb(var(--text))]";

  const theirBubble =
    "bg-[rgba(var(--panel)/0.85)] text-[rgb(var(--text))] backdrop-blur";

  const wrapper = isOwn ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${wrapper} py-1`}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.55 }}
        className="flex flex-col"
      >
        {message?.image ? (
          <div className={`${bubbleBase} ${isOwn ? ownBubble : theirBubble} p-2`}>
            <img
              src={message.image}
              alt="Sent"
              className="max-h-[320px] w-full rounded-xl object-cover"
              loading="lazy"
            />
            {showMeta && (time || isOwn) ? (
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
                {time ? <span>{time}</span> : null}
                {isOwn ? <DeliveryTicks status={status} /> : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className={`${bubbleBase} ${isOwn ? ownBubble : theirBubble}`}>
            <div className="whitespace-pre-wrap break-words">{message?.message}</div>
            {showMeta && (time || isOwn) ? (
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
                {time ? <span>{time}</span> : null}
                {isOwn ? <DeliveryTicks status={status} /> : null}
              </div>
            ) : null}
          </div>
        )}
      </motion.div>
    </div>
  );
});

