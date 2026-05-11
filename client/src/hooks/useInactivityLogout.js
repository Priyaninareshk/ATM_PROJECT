import { useEffect } from "react";

const EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

export default function useInactivityLogout(onTimeout, timeoutMs = 2 * 60 * 1000) {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onTimeout, timeoutMs);
    };

    EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onTimeout, timeoutMs]);
}
