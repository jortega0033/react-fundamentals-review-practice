import { useMemo, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { SearchInput } from '../fundamentals/SearchInput';
import { TaskStats } from '../fundamentals/TaskStats';
import { TaskRow } from '../fundamentals/TaskRow';
import { ControlledForm } from '../fundamentals/ControlledForm';
import { Card } from '../fundamentals/Card';
import { TaskSummaryList } from '../fundamentals/TaskSummaryFragment';
import { useTaskFilters } from '../fundamentals/useTaskFilters';

export function TaskList() {
  const { tasks, loading, toggleTask, addTask } = useTasks();
  const [query, setQuery] = useState('');
  const { status, sortOrder, setStatus, setSortOrder } = useTaskFilters();

  // useMemo: filtering AND sorting both depend only on tasks/query/status/
  // sortOrder — recompute when any of those actually change, not on every
  // render this component happens to be part of.
  const visibleTasks = useMemo(() => {
    const matchesQuery = tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase()),
    );
    const matchesStatus = matchesQuery.filter((task) => {
      if (status === 'done') return task.done;
      if (status === 'pending') return !task.done;
      return true;
    });
    // Sort a COPY — never mutate the array returned from state directly.
    const sorted = [...matchesStatus].sort((a, b) =>
      sortOrder === 'newest' ? b.id - a.id : a.id - b.id,
    );
    return sorted;
  }, [tasks, query, status, sortOrder]);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <Card title="Tasks">
      <ControlledForm onSubmit={(title) => addTask(title)} />
      <SearchInput onSearch={setQuery} />

      <div className="filters">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label>
          Sort
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      <TaskStats tasks={tasks} />

      <ul>
        {visibleTasks.map((task) => (
          // Stable, meaningful key (the task's own id) — not the array
          // index, which would misattribute state across items the moment
          // filtering, sorting, or reordering changes which index a given
          // task sits at.
          <TaskRow key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </ul>

      <h3>Summary</h3>
      <TaskSummaryList tasks={visibleTasks} />
    </Card>
  );
}
