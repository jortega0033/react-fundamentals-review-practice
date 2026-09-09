export function StatusBadge({ done, theme }: { done: boolean; theme: 'light' | 'dark' }) {
  return (
    <span className={`badge status-badge status-badge--${theme}`}>
      {done ? 'Done' : 'Pending'}
    </span>
  );
}
