import { useState, type FormEvent } from 'react';

/**
 * Controlled inputs: the input's displayed value comes FROM React state
 * (`value={title}`), and every keystroke writes back INTO that state
 * (`onChange`). React is the single source of truth for what's on screen —
 * you can validate, transform, or reject a keystroke before it ever
 * renders, and the current value is always readable from state, not by
 * reaching into the DOM.
 *
 * The opposite is an UNCONTROLLED input (no `value` prop, read via a ref
 * only when needed, e.g. on submit) — simpler for a one-off value nothing
 * else needs to react to live, but you lose live validation and the "state
 * is the source of truth" guarantee.
 *
 * The classic bug this file avoids: starting a controlled input from
 * `undefined` (e.g. `useState()` with no initial value). React logs a
 * warning the first time it goes from uncontrolled (undefined) to
 * controlled (a real string) — always give a real initial value, even if
 * it's just `''`.
 */
export function ControlledForm({ onSubmit }: { onSubmit: (title: string, priority: string) => void }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), priority);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Priority
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </label>
      <button type="submit" disabled={!title.trim()}>Add task</button>
    </form>
  );
}
