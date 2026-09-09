import { useMemo, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { SearchInput } from '../fundamentals/SearchInput';
import { TaskStats } from '../fundamentals/TaskStats';
import { TaskRow } from '../fundamentals/TaskRow';
import { ControlledForm } from '../fundamentals/ControlledForm';

export function TaskList() {
  const { tasks, loading, toggleTask, addTask } = useTasks();
  const [query, setQuery] = useState('');

  // useMemo: filtering is cheap here, but the pattern matters more than the
  // size of this particular list — re-filter only when tasks or the query
  // actually change, not on every unrelated re-render (e.g. the theme
  // toggle in the header).
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query],
  );

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <ControlledForm onSubmit={(title) => addTask(title)} />
      <SearchInput onSearch={setQuery} />
      <TaskStats tasks={tasks} />
      <ul>
        {filteredTasks.map((task) => (
          // Stable, meaningful key (the task's own id) — not the array
          // index, which would misattribute state across items the moment
          // filtering or reordering changes which index a given task sits
          // at.
          <TaskRow key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </ul>
    </div>
  );
}
