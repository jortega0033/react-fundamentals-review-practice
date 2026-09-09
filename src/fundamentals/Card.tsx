import type { ReactNode } from 'react';

/**
 * Composition via `children` — the prop every element already has implicit
 * support for (`<Card>...</Card>` is just `<Card children={...} />`).
 * This is how React avoids the deep "pass every possible prop down through
 * a chain of wrapper components" problem: instead of `Card` needing to
 * know about and forward every prop a `Button` or `TaskRow` inside it
 * might need, the caller just puts the real element directly between the
 * tags, and `Card` only needs to know where to place SOME markup around
 * whatever it's handed.
 *
 * Prefer this over a component that takes a dozen `render*` or content
 * props to configure every part of its output — `children` (and, for a
 * component with more than one insertion point, several distinctly named
 * props that are themselves `ReactNode`) keeps the caller writing normal
 * JSX instead of passing JSX-shaped configuration objects.
 */
export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
