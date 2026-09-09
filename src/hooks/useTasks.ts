import { useCallback, useEffect, useState } from 'react';
import { fetchTasks, type Task } from '../api/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTasks().then((result) => {
      if (!cancelled) {
        setTasks(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // useCallback: stable reference across re-renders. TaskRow is wrapped in
  // React.memo specifically so it can skip re-rendering when its own props
  // haven't changed — that only works if `onToggle` is the same function
  // each time, not a fresh closure created every render. Without this,
  // memo(TaskRow) would still re-render every row on every keystroke in the
  // search box, silently defeating the whole point of memoizing it.
  const toggleTask = useCallback((id: number) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }, []);

  return { tasks, loading, toggleTask };
}
