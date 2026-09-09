export function BulkActions({
  onMarkAllDone,
  onRemoveFirstCompleted,
}: {
  onMarkAllDone: () => void;
  onRemoveFirstCompleted: () => void;
}) {
  return (
    <div className="bulk-actions">
      <button type="button" onClick={onMarkAllDone}>Mark all done</button>
      <button type="button" onClick={onRemoveFirstCompleted}>Remove first completed</button>
    </div>
  );
}
