// ============================================================
// XFLIX — Hook
// useDebounce: debounces a value by a given delay
// ============================================================

import { useEffect, useState } from "react";

/**
 * Debounce a value by a given delay in ms.
 * Useful for search inputs to avoid triggering on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
