import { useEffect, RefObject } from "react";

/**
 * Watches all ".reveal" elements inside the given container ref and adds
 * the "visible" class once each one scrolls into view — same behavior as
 * the original vanilla-JS IntersectionObserver.
 */
export function useReveal(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}