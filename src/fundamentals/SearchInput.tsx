import { useEffect, useRef, useState } from 'react';

/**
 * useRef, two different jobs in one component:
 *
 * 1. DOM access (`inputRef`) — a direct handle to the real <input> element,
 *    used here to autofocus it on mount. This is what useRef is for:
 *    reaching outside React's render output to an actual DOM node.
 *
 * 2. A mutable value that must survive re-renders WITHOUT causing one
 *    (`debounceTimer`) — the pending setTimeout id. If this were useState
 *    instead, every debounce tick would trigger an extra re-render for a
 *    value the JSX never reads. useRef's `.current` mutates in place and
 *    changing it is invisible to React — exactly what a "just remember
 *    this until next time" value like a timer id needs.
 *
 * The actual searchable text (`value`) IS useState, correctly — it drives
 * what's rendered in the input, so React needs to know when it changes.
 */
export function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(next: string) {
    setValue(next);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => onSearch(next), 300);
  }

  // Cleanup: a pending timer must not fire after this component is gone —
  // it would call onSearch with a stale closure over a query nobody can see.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search tasks..."
      aria-label="Search tasks"
    />
  );
}
