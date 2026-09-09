/**
 * Three ways to render conditionally, and when each one reads best:
 *
 * 1. Early return — the component has nothing to show yet at all. Reaches
 *    for a completely different, simpler return before the "normal" JSX
 *    even starts. Best when the alternative isn't really "part of" the
 *    normal render, it's a separate state entirely (loading, error, empty).
 *
 * 2. Ternary (`condition ? <A /> : <B />`) — exactly two real outcomes,
 *    both worth naming. Reads badly once nested (`a ? <X/> : b ? <Y/> :
 *    <Z/>` is a common but genuinely hard-to-scan pattern) — past two
 *    branches, prefer an early return or a small lookup/switch instead.
 *
 * 3. `&&` (`condition && <A />`) — one optional thing, no "else" to show.
 *    The classic footgun: if `condition` is a number, `0 && <A/>` renders
 *    the literal `0` on screen, not nothing — `items.length && <List/>`
 *    is a real, common bug. Coerce to a real boolean first
 *    (`items.length > 0 && ...`) or use a ternary with `null`.
 */
export function ConditionalRenderingExamples({
  status,
  itemCount,
}: {
  status: 'loading' | 'error' | 'ready';
  itemCount: number;
}) {
  // 1. Early return — loading/error are not "part of" the ready UI below.
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p role="alert">Something went wrong.</p>;

  return (
    <div>
      {/* 2. Ternary — exactly two outcomes, both worth naming. */}
      {itemCount > 0 ? <p>{itemCount} items</p> : <p>No items yet</p>}

      {/* 3. && guarded against the falsy-number footgun above. */}
      {itemCount > 5 && <p>That's a lot — consider filtering.</p>}
    </div>
  );
}
