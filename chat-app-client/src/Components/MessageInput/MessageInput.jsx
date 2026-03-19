import { memo, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiSend, FiSmile, FiX } from "react-icons/fi";

export const MessageInput = memo(function MessageInput({
  value,
  onChange,
  onSend,
  onPickImage,
  previewUrl,
  onRemoveImage,
  disabled,
  onTyping,
  placeholder = "Message…",
}) {
  const fileRef = useRef(null);

  const canSend = useMemo(() => {
    const hasText = Boolean(value && value.trim().length);
    const hasImage = Boolean(previewUrl);
    return !disabled && (hasText || hasImage);
  }, [value, previewUrl, disabled]);

  const openFilePicker = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      if (e.shiftKey) return; // newline
      e.preventDefault();
      if (canSend) onSend?.();
    },
    [canSend, onSend]
  );

  return (
    <div className="border-t border-white/10 bg-[rgba(var(--panel)/0.35)] backdrop-blur-xl">
      <div className="mx-auto w-full px-3 pb-3 pt-2 md:px-5">
        {previewUrl ? (
          <div className="mb-2 inline-flex items-start gap-2 rounded-2xl border border-white/10 bg-[rgba(var(--panel)/0.6)] p-2">
            <img src={previewUrl} alt="Preview" className="h-20 w-20 rounded-xl object-cover" />
            <button
              type="button"
              onClick={onRemoveImage}
              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[rgb(var(--text))] hover:bg-white/10"
              aria-label="Remove image"
            >
              <FiX />
            </button>
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />

          <button
            type="button"
            onClick={openFilePicker}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
            aria-label="Add image"
          >
            <FiPlus className="text-lg" />
          </button>

          <div className="flex min-h-11 flex-1 items-end gap-2 rounded-2xl border border-white/10 bg-[rgba(var(--panel)/0.55)] px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] focus-within:ring-2 focus-within:ring-[rgba(var(--ring)/0.45)]">
            <button
              type="button"
              className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[rgb(var(--muted))] hover:bg-white/10 hover:text-[rgb(var(--text))]"
              aria-label="Emoji (coming soon)"
              disabled
            >
              <FiSmile />
            </button>

            <textarea
              value={value}
              onChange={(e) => {
                onChange?.(e.target.value);
                onTyping?.();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] focus:outline-none"
            />
          </div>

          <motion.button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            whileTap={canSend ? { scale: 0.92 } : undefined}
            whileHover={canSend ? { scale: 1.02 } : undefined}
            className={[
              "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 transition",
              canSend
                ? "bg-[rgb(var(--primary))] text-black shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                : "bg-white/5 text-[rgb(var(--muted))] opacity-60",
            ].join(" ")}
            aria-label="Send message"
          >
            <FiSend className="text-lg" />
          </motion.button>
        </div>
      </div>
    </div>
  );
});

