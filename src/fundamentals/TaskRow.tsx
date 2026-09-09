import { memo, useState } from 'react';
import type { Task } from '../api/tasksApi';

export const TaskRow = memo(function TaskRow({
  task,
  onToggle,
  onRename,
}: {
  task: Task;
  onToggle: (id: number) => void;
  onRename: (id: number, title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');

  function commitRename() {
    onRename(task.id, draftTitle);
    setIsEditing(false);
  }

  return (
    <li className={`task${task.done ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as done`}
      />
      {isEditing ? (
        <input
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => e.key === 'Enter' && commitRename()}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: task.title }}
        />
      )}
      <div className="task-delete" onClick={() => onToggle(task.id)}>
        ×
      </div>
    </li>
  );
});
