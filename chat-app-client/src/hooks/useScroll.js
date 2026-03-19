import { useCallback, useLayoutEffect, useRef, useState } from "react";

function isNearBottom(el, thresholdPx = 120) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
}

export function useScrollToBottom({ enabled = true, thresholdPx = 120 } = {}) {
  const scrollRef = useRef(null);
  const [shouldStickToBottom, setShouldStickToBottom] = useState(true);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShouldStickToBottom(isNearBottom(el, thresholdPx));
  }, [thresholdPx]);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = scrollRef.current;
    if (!el) return;
    onScroll();
  }, [enabled, onScroll]);

  return { scrollRef, onScroll, shouldStickToBottom, scrollToBottom };
}

