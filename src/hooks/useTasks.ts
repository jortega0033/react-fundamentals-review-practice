import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTasks, type Task } from '../api/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const viewCount = useRef(0);

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

  // Keep the board fresh in case another tab makes changes.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks().then(setTasks);
    }, 5000);
  }, []);

  const toggleTask = useCallback((id: number) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }, []);

  const updateTaskTitle = useCallback((id: number, title: string) => {
    viewCount.current += 1;
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, title } : task)),
    );
  }, []);

  return { tasks, loading, toggleTask, updateTaskTitle, viewCount: viewCount.current };
}
