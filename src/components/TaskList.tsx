import { useMemo, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { SearchInput } from '../fundamentals/SearchInput';
import { TaskStats } from '../fundamentals/TaskStats';
import { TaskRow } from '../fundamentals/TaskRow';

export function TaskList() {
  const { tasks, loading, toggleTask, updateTaskTitle, viewCount } = useTasks();
  const [query, setQuery] = useState('');

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query],
  );

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <SearchInput onSearch={setQuery} />
      <TaskStats tasks={tasks} />
      <p>Edits this session: {viewCount}</p>
      <ul>
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={(id) => toggleTask(id)}
            onRename={updateTaskTitle}
          />
        ))}
      </ul>
    </div>
  );
}
