import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { API_ENDPOINTS } from "../config/api.js";
import { apiRequest } from "../services/apiClient.js";
import { getSocket } from "../services/socket.js";
import { ChatFeed } from "../Components/ChatFeed/ChatFeed.jsx";
import { MessageInput } from "../Components/MessageInput/MessageInput.jsx";
import { useScrollToBottom } from "../hooks/useScroll.js";
import { useTypingIndicator } from "../hooks/useTypingIndicator.js";

const socket = getSocket();

function makeRoom(a, b) {
  if (!a || !b) return null;
  return [a, b].sort().join("-");
}

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selectedUser = location.state || {};

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const peerId = selectedUser?._id;
  const selfId = user?.id;
  const room = useMemo(() => makeRoom(selfId, peerId), [selfId, peerId]);

  const { scrollRef, onScroll, shouldStickToBottom, scrollToBottom } = useScrollToBottom({
    enabled: true,
    thresholdPx: 140,
  });

  const { isPeerTyping, emitTyping, emitStopTyping } = useTypingIndicator(socket, {
    room,
    selfId,
    peerId,
  });

  const typingThrottle = useRef(0);
  const typingStopTimer = useRef(null);

  const notifyTyping = () => {
    const now = Date.now();
    if (now - typingThrottle.current > 450) {
      typingThrottle.current = now;
      emitTyping();
    }
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    typingStopTimer.current = setTimeout(() => emitStopTyping(), 900);
  };

  useEffect(() => {
    if (!user || !peerId) return;
    if (room) socket.emit("joinRoom", room);

    const fetchMessages = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.MESSAGES(peerId), { method: "GET" });
        setMessages(Array.isArray(data) ? data : []);
        await apiRequest(API_ENDPOINTS.MARK_AS_READ(peerId), { method: "PUT" });
        requestAnimationFrame(() => scrollToBottom("auto"));
      } catch {
        // no-op
      }
    };

    fetchMessages();
  }, [user, peerId, room, scrollToBottom]);

  useEffect(() => {
    const onNewMessage = (newMessage) => {
      // Keep previous behavior: append everything server sends.
      setMessages((prev) => [...prev, newMessage]);
    };
    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, []);

  useEffect(() => {
    return () => {
      if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    };
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const data = await apiRequest(API_ENDPOINTS.UPLOAD, {
      method: "POST",
      body: formData,
      auth: "none",
    });
    return data?.imageUrl || null;
  };

  const handlePickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const url = await handleImageUpload(file);
      setImageUrl(url);
    } catch {
      setImageUrl(null);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setImageUrl(null);
  };

  const sendMessage = async () => {
    const hasText = Boolean(messageText && messageText.trim().length);
    const hasImage = Boolean(imageUrl);
    if (!hasText && !hasImage) return;
    if (!selfId || !peerId) return;

    const formData = new FormData();
    formData.append("senderId", selfId);
    formData.append("receiverId", peerId);
    if (hasText) formData.append("message", messageText.trim());
    if (hasImage) formData.append("image", imageUrl);

    try {
      const savedMessage = await apiRequest(API_ENDPOINTS.SEND_MESSAGE, {
        method: "POST",
        body: formData,
      });
      socket.emit("sendMessage", savedMessage);
      emitStopTyping();
    } catch {
      // no-op
    } finally {
      setMessageText("");
      removeImage();
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  };

  const deleteAllChats = async () => {
    if (!peerId) return;
    if (!window.confirm("Are you sure you want to delete all messages?")) return;
    try {
      await apiRequest(API_ENDPOINTS.DELETE_ALL_MESSAGES(peerId), { method: "DELETE" });
      setMessages([]);
    } catch {
      // no-op
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(var(--panel)/0.45)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
            onClick={() => navigate("/messages")}
            aria-label="Back"
          >
            <FiArrowLeft className="text-lg" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <img
              src={selectedUser?.profilePicture || "./profile.jpg"}
              alt={selectedUser?.username || "Chat"}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[rgb(var(--text))]">
                {selectedUser?.username || "Chat"}
              </div>
              <div className="text-xs text-[rgb(var(--muted))]">
                {isPeerTyping ? "Typing…" : "Online"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={deleteAllChats}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
          >
            <FiTrash2 />
            Clear
          </button>
        </div>
      </div>

      <ChatFeed
        userId={selfId}
        messages={messages}
        scrollRef={scrollRef}
        onScroll={onScroll}
        autoStickToBottom={shouldStickToBottom}
        scrollToBottom={scrollToBottom}
        isPeerTyping={isPeerTyping}
      />

      <MessageInput
        value={messageText}
        onChange={setMessageText}
        onSend={sendMessage}
        onPickImage={handlePickImage}
        previewUrl={previewUrl}
        onRemoveImage={removeImage}
        disabled={!selfId || !peerId}
        onTyping={notifyTyping}
        placeholder="Message… (Enter to send, Shift+Enter for new line)"
      />
    </div>
  );
}

