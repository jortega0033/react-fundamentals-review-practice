export function ActivityLog({ entries }: { entries: string[] }) {
  if (entries.length === 0) return null;
  return (
    <ul className="activity-log">
      {entries.map((entry) => (
        <li>{entry}</li>
      ))}
    </ul>
  );
}
