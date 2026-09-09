import { useEffect, useRef } from 'react';

/**
 * Custom hook — composes useRef + useEffect to remember a value from the
 * PREVIOUS render, without causing an extra one. The ref updates after
 * render (in the effect), so during the current render `.current` still
 * holds last render's value; only after paint does it catch up.
 *
 * Extracting this into its own hook, instead of inlining the ref+effect
 * pair wherever "previous value" is needed, is the general shape custom
 * hooks are for: reusable stateful logic with no JSX of its own.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
