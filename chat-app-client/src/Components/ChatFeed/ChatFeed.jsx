import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageBubble } from "../MessageBubble/MessageBubble.jsx";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator.jsx";
import { SeenStatus } from "../SeenStatus/SeenStatus.jsx";

export function ChatFeed({
  userId,
  messages,
  scrollRef,
  onScroll,
  autoStickToBottom,
  scrollToBottom,
  isPeerTyping,
  emptyState,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!autoStickToBottom) return;
    scrollToBottom?.("smooth");
  }, [messages?.length, autoStickToBottom, scrollToBottom]);

  const lastOwnMessageStatus = useMemo(() => {
    if (!messages?.length || !userId) return null;
    const own = [...messages].reverse().find((m) => m?.sender === userId);
    if (!own) return null;
    if (own.seen || own.isRead) return "seen";
    return "delivered";
  }, [messages, userId]);

  const handleImageClick = (src) => {
    setPreviewImage(src);
  };

  const closePreview = () => setPreviewImage(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3 [scrollbar-gutter:stable] md:px-5"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages?.length ? (
          <AnimatePresence initial={false}>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="mx-auto flex w-full flex-col"
            >
              {messages.map((msg, index) => {
                console.log("Incoming message:", msg);
                return (
                  <MessageBubble
                    key={msg?._id || `${msg?.sender}-${msg?.receiver}-${index}`}
                    message={msg}
                    isOwn={msg?.sender === userId}
                    groupedWithPrev={
                      index > 0 && messages[index - 1]?.sender === msg?.sender
                    }
                    onImageClick={handleImageClick}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          emptyState ?? (
            <div className="mx-auto flex h-full w-full items-center justify-center">
              <div className="rounded-2xl border border-white/10 bg-[rgba(var(--panel)/0.6)] px-5 py-4 text-center backdrop-blur">
                <div className="text-sm font-medium text-[rgb(var(--text))]">No messages yet</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Say hi to start the conversation.
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {isPeerTyping ? <TypingIndicator /> : null}

      <SeenStatus status={lastOwnMessageStatus} />

      {previewImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={closePreview}
        >
          <motion.img
            src={previewImage}
            alt="Preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}

