import { useMemo } from 'react';
import type { Task } from '../api/tasksApi';
import { usePrevious } from './usePrevious';

/**
 * useMemo — caches an expensive derived value so it's only recomputed when
 * its actual inputs (`tasks`) change, not on every render this component
 * happens to be part of (e.g. a parent re-rendering because unrelated state
 * changed). The computation here is trivial, but the pattern is the same
 * regardless of size: don't redo work whose real inputs haven't changed.
 * useMemo is NOT for every derived value — a cheap computation (a single
 * .length or a ternary) doesn't need it; memoizing has its own small cost
 * and reaching for it reflexively adds noise without saving anything real.
 */
export function TaskStats({ tasks }: { tasks: Task[] }) {
  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const previousDoneCount = usePrevious(doneCount);

  const delta =
    previousDoneCount !== undefined && doneCount !== previousDoneCount
      ? doneCount - previousDoneCount
      : 0;

  return (
    <p>
      {doneCount} of {tasks.length} done
      {delta !== 0 && <span> ({delta > 0 ? '+' : ''}{delta} since last check)</span>}
    </p>
  );
}
