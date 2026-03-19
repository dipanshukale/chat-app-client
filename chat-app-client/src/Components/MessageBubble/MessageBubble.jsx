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
  groupedWithPrev = false,
  onImageClick,
  showMeta = true,
}) {
  console.log("Incoming message:", message);

  const time = useMemo(
    () => formatTime(message?.createdAt || message?.timestamp || message?.time),
    [message]
  );

  const status = message?.seen ? "seen" : message?.delivered ? "delivered" : "sent";

  const imageSrc = message?.image || message?.imageUrl || message?.file;

  const bubbleBase =
    "max-w-[78%] md:max-w-[64%] px-3.5 py-2.5 text-sm leading-relaxed ring-1";

  const ownBubble =
    "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#5B51D8] text-white ring-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.35)]";

  const theirBubble =
    "bg-[rgba(255,255,255,0.08)] text-[rgb(var(--text))] ring-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.30)] backdrop-blur";

  const wrapper = isOwn ? "justify-end" : "justify-start";

  const spacing = groupedWithPrev ? "pt-0.5" : "pt-2.5";
  const radius = isOwn
    ? groupedWithPrev
      ? "rounded-3xl rounded-tr-xl"
      : "rounded-3xl"
    : groupedWithPrev
    ? "rounded-3xl rounded-tl-xl"
    : "rounded-3xl";

  return (
    <div className={`flex ${wrapper} ${spacing}`}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.55 }}
        className="flex flex-col"
      >
        <div className={`${bubbleBase} ${radius} ${isOwn ? ownBubble : theirBubble}`}>
          <div className="flex flex-col gap-1">
            {imageSrc && (
              <button
                type="button"
                onClick={() => onImageClick?.(imageSrc)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Open image"
              >
                <div className="mt-1">
                  <img
                    src={imageSrc}
                    alt="chat"
                    className="rounded-xl max-w-[240px] w-full h-auto object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Image failed:", imageSrc);
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </button>
            )}

            {message?.message && (
              <div className="whitespace-pre-wrap break-words">{message.message}</div>
            )}
          </div>

          {showMeta && (time || isOwn) ? (
            <div
              className={[
                "mt-1 flex items-center justify-end gap-1 text-[10px]",
                isOwn ? "text-white/75" : "text-white/60",
              ].join(" ")}
            >
              {time ? <span>{time}</span> : null}
              {isOwn ? <DeliveryTicks status={status} /> : null}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
});

