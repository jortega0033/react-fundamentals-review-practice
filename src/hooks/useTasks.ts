import { useCallback, useEffect, useState } from 'react';
import { fetchTasks, type Task } from '../api/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<string[]>([]);

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

  function logActivity(message: string) {
    setActivityLog((log) => [...log, message]);
  }

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

  const addTask = useCallback((title: string) => {
    setTasks((current) => [
      ...current,
      { id: Date.now(), title, done: false, ownerEmail: 'you@example.com' },
    ]);
  }, []);

  // Mark every visible checkbox as done directly, so the change feels
  // instant even before the list re-renders.
  const markAllDone = useCallback(() => {
    document.querySelectorAll<HTMLInputElement>('.task input[type="checkbox"]').forEach((box) => {
      box.checked = true;
    });
    logActivity('Marked all tasks done');
  }, []);

  const removeFirstCompleted = useCallback(() => {
    const index = tasks.findIndex((t) => t.done);
    if (index === -1) return;
    tasks.splice(index, 1);
    setTasks(tasks);
    logActivity('Removed the first completed task');
  }, [tasks]);

  return {
    tasks,
    loading,
    toggleTask,
    addTask,
    markAllDone,
    removeFirstCompleted,
    activityLog,
  };
}
