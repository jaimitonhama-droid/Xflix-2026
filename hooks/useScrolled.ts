// ============================================================
// XFLIX — Hook
// useScrolled: tracks whether the page has been scrolled
// ============================================================

import { useEffect, useState } from "react";

/**
 * Returns true when the page scroll position exceeds the threshold.
 * Used to apply backdrop blur / dark bg to navbar on scroll.
 *
 * @param threshold - Scroll Y threshold in px (default: 10)
 * @returns boolean indicating if scrolled past threshold
 */
export function useScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
