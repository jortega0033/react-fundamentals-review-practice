import { Fragment } from 'react';
import type { Task } from '../api/tasksApi';

/**
 * Fragments (`<>...</>`, or `<Fragment>...</Fragment>` when a `key` is
 * needed) — group several elements together WITHOUT adding a real DOM
 * node around them. A component must return one single root element, but
 * "one element" doesn't have to mean "one extra <div>" — a stray wrapper
 * div is a common, avoidable source of broken CSS (an extra flex/grid
 * item, an unwanted layout box) and unnecessary DOM depth.
 *
 * The explicit `<Fragment key={...}>` form (not the `<>` shorthand) is
 * required specifically when mapping a list of fragments, the same reason
 * any list item needs a key — see the Lists and keys section of the guide.
 */
export function TaskSummaryList({ tasks }: { tasks: Task[] }) {
  return (
    <dl>
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <dt>{task.title}</dt>
          <dd>{task.done ? 'Done' : 'Pending'}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
