import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { API_ENDPOINTS } from "../config/api.js";
import { apiRequest } from "../services/apiClient.js";
import { getSocket } from "../services/socket.js";
import { listItem, listStagger } from "../ui/motion/presets.js";

const socket = getSocket();

function ChatRow({ chatUser, active, onClick }) {
  return (
    <motion.button
      type="button"
      variants={listItem}
      onClick={onClick}
      className={[
        "w-full text-left",
        "flex items-center gap-3 rounded-2xl px-3 py-2.5",
        "border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.65)]",
        active ? "bg-[rgba(var(--panel)/0.9)]" : "bg-[rgba(var(--panel)/0.55)]",
        "hover:bg-[rgba(var(--panel)/0.9)] hover:-translate-y-0.5",
        "transition-transform",
      ].join(" ")}
    >
      <div className="relative">
        <img
          src={chatUser.profilePicture || "./profile.jpg"}
          alt={chatUser.username}
          className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-[rgba(0,0,0,0.8)] ${
            chatUser.isOnline ? "bg-emerald-400" : "bg-zinc-500"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold text-[rgb(var(--text))]">
            {chatUser.username}
          </div>
          {chatUser.unreadCount > 0 ? (
            <div className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[rgb(var(--primary))] px-1.5 text-[11px] font-bold text-black shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
              {chatUser.unreadCount}
            </div>
          ) : null}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[rgb(var(--muted))]">
          {chatUser.lastMessage || "Start a conversation"}
        </div>
      </div>
    </motion.button>
  );
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChatUsers = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(API_ENDPOINTS.FOLLOWING_LIST, { method: "GET" });
        const unreadData = await apiRequest(API_ENDPOINTS.UNREAD_MESSAGES, { method: "GET" });

        const updated = data.following.map((u) => ({
          ...u,
          unreadCount: unreadData[u.id] || 0,
          lastMessage: "",
        }));
        setChatUsers(updated);
      } catch {
        // no-op: keep UI stable
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const onNewMessage = (newMessage) => {
      if (newMessage?.receiver !== user.id) return;
      setChatUsers((prev) =>
        prev.map((chatUser) =>
          chatUser._id === newMessage.sender
            ? {
                ...chatUser,
                unreadCount: (chatUser.unreadCount || 0) + 1,
                lastMessage: newMessage?.message ? newMessage.message : "New message",
              }
            : chatUser
        )
      );
    };
    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [user?.id]);

  const openChat = (chatUser) => {
    navigate(`/chat/${chatUser._id}`, { state: chatUser });
    setChatUsers((prev) =>
      prev.map((u) => (u.id === chatUser._id ? { ...u, unreadCount: 0, lastMessage: "" } : u))
    );
    apiRequest(API_ENDPOINTS.MARK_AS_READ(chatUser._id), { method: "PUT" }).catch(() => {});
  };

  const hasRows = chatUsers.length > 0;

  const title = useMemo(() => (loading ? "Messages" : "Messages"), [loading]);

  return (
    <div className="min-h-[100dvh]">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(var(--panel)/0.55)] backdrop-blur-xl">
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
            <div className="text-base font-semibold text-[rgb(var(--text))]">{title}</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              Premium, distraction‑free messaging.
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-4">
        {loading && !hasRows ? (
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[66px] animate-pulse rounded-2xl border border-white/10 bg-[rgba(var(--panel)/0.35)]"
              />
            ))}
          </div>
        ) : hasRows ? (
          <motion.div
            variants={listStagger}
            initial="initial"
            animate="animate"
            className="grid gap-2"
          >
            {chatUsers.map((u) => (
              <ChatRow key={u._id} chatUser={u} onClick={() => openChat(u)} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[rgba(var(--panel)/0.55)] p-6 text-center backdrop-blur-2xl">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(0,0,0,0.4)] text-[rgb(var(--primary))]">
              💬
            </div>
            <div className="text-sm font-semibold text-[rgb(var(--text))]">
              Start a conversation
            </div>
            <div className="mt-1 text-xs text-[rgb(var(--muted))]">
              Follow someone from the Home page, then come back here to chat with them.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

