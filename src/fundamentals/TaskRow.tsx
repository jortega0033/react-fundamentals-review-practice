import { memo } from 'react';
import type { Task } from '../api/tasksApi';

/**
 * React.memo skips a re-render when props are shallowly equal to last time.
 * It only pays off if the PARENT re-renders often for reasons unrelated to
 * this child's own props — memoizing a component that always gets new
 * props anyway does nothing but add a comparison cost.
 *
 * For that shallow-equality check to actually hold across parent
 * re-renders, `onToggle` must be the SAME function reference each time,
 * not a fresh arrow function recreated every render — see useCallback in
 * TaskListFundamentals.tsx, which is the other half of this pattern.
 */
export const TaskRow = memo(function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: number) => void;
}) {
  return (
    <li className={`task${task.done ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as done`}
      />
      <span>{task.title}</span>
    </li>
  );
});
