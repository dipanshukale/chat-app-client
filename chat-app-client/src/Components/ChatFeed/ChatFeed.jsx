import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageBubble } from "../MessageBubble/MessageBubble.jsx";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator.jsx";

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
  useEffect(() => {
    if (!autoStickToBottom) return;
    scrollToBottom?.("smooth");
  }, [messages?.length, autoStickToBottom, scrollToBottom]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2 [scrollbar-gutter:stable] md:px-5"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages?.length ? (
          <AnimatePresence initial={false}>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="mx-auto flex w-full max-w-3xl flex-col"
            >
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg?._id || `${msg?.sender}-${msg?.receiver}-${index}`}
                  message={msg}
                  isOwn={msg?.sender === userId}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          emptyState ?? (
            <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-center">
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
    </div>
  );
}

