import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Best-effort typing indicator.
 * If the backend doesn't support these events, UI simply won't show.
 */
export function useTypingIndicator(socket, { room, selfId, peerId, timeoutMs = 1600 } = {}) {
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const stopTimer = useRef(null);

  const api = useMemo(() => {
    const emitTyping = () => {
      if (!socket || !room || !selfId || !peerId) return;
      socket.emit("typing", { room, from: selfId, to: peerId });
    };
    const emitStopTyping = () => {
      if (!socket || !room || !selfId || !peerId) return;
      socket.emit("stopTyping", { room, from: selfId, to: peerId });
    };
    return { emitTyping, emitStopTyping };
  }, [socket, room, selfId, peerId]);

  useEffect(() => {
    if (!socket) return;

    const onTyping = (payload) => {
      if (!payload) return;
      const matches =
        (payload.room && room && payload.room === room) ||
        (payload.from && peerId && payload.from === peerId);
      if (!matches) return;

      setIsPeerTyping(true);
      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => setIsPeerTyping(false), timeoutMs);
    };

    const onStopTyping = (payload) => {
      if (!payload) return;
      const matches =
        (payload.room && room && payload.room === room) ||
        (payload.from && peerId && payload.from === peerId);
      if (!matches) return;
      setIsPeerTyping(false);
    };

    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);

    return () => {
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, [socket, room, peerId, timeoutMs]);

  return { isPeerTyping, ...api };
}

