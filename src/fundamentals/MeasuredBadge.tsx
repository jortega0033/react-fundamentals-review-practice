import { useLayoutEffect, useRef, useState } from 'react';

/**
 * useLayoutEffect vs useEffect — same API, different timing:
 *
 * - useEffect runs AFTER the browser has painted the screen. Fine for
 *   almost everything: fetching data, subscriptions, logging, syncing to
 *   external systems. The user sees the render before the effect runs.
 * - useLayoutEffect runs BEFORE the browser paints, synchronously, right
 *   after React has updated the DOM. It BLOCKS the paint until it
 *   finishes — use it only when the effect needs to measure or mutate the
 *   DOM in a way the user must never see a flash of the "before" state
 *   for. Measuring an element's real rendered size to immediately
 *   position something relative to it (this file's example) is the
 *   textbook case; using it as a default "useEffect but I want it to run
 *   sooner" is a performance mistake, since it holds up every paint.
 *
 * Rule of thumb: reach for useEffect first, always. Switch to
 * useLayoutEffect only when you can name the visual flicker useEffect's
 * later timing would actually cause.
 */
export function MeasuredBadge({ label }: { label: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.getBoundingClientRect().width);
    }
  }, [label]);

  return (
    <span ref={spanRef} className="badge" title={width ? `${Math.round(width)}px wide` : undefined}>
      {label}
    </span>
  );
}
