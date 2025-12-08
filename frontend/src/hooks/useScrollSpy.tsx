/**
 * Hook: useScrollSpy
 * Purpose: Given an array of element IDs, returns the currently active
 * section ID based on scroll position. Useful for highlighting
 * navigation items while the user scrolls through sections.
 */
import { useEffect, useState } from "react";

type Options = {
  // distance from top of viewport in px to consider as "active" (default: center)
  activeOffset?: number | null;
};

export default function useScrollSpy(ids: string[], options: Options = {}) {
  const { activeOffset = null } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!ids || ids.length === 0) return;

    const getElements = () =>
      ids
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

    const updateActiveByScroll = () => {
      const elements = getElements();
      if (elements.length === 0) return;

      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const referenceY =
        activeOffset !== null ? activeOffset : viewportHeight / 2;

      // try to find element that contains referenceY
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= referenceY && rect.bottom >= referenceY) {
          if (el.id !== activeId) setActiveId(el.id);
          return;
        }
      }

      // fallback: choose the element whose top is nearest to the reference
      let candidate: { id: string; distance: number } | null = null;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - referenceY);
        if (!candidate || distance < candidate.distance)
          candidate = { id: el.id, distance };
      }
      if (candidate && candidate.id !== activeId) setActiveId(candidate.id);
    };

    // initial update
    updateActiveByScroll();

    window.addEventListener("scroll", updateActiveByScroll, { passive: true });
    window.addEventListener("resize", updateActiveByScroll);

    // also observe DOM mutations in case sections are rendered after mount
    const mo = new MutationObserver(() => {
      updateActiveByScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updateActiveByScroll);
      window.removeEventListener("resize", updateActiveByScroll);
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ids), String(activeOffset)]);

  return activeId;
}
