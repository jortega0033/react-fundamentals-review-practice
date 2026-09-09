import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';

// The task title now appears twice by design (the task row, and the
// Summary <dl> below it) — scope queries to the list so the assertion
// still says exactly what it means, instead of switching to a looser
// getAllByText that would silently pass even if only one of the two
// copies rendered correctly.
function taskListRegion() {
  return within(screen.getByRole('list'));
}

describe('TaskList', () => {
  it('renders tasks once loaded', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(taskListRegion().getByText('Write quarterly report')).toBeInTheDocument();
    });
  });

  it('adds a new task via the controlled form', async () => {
    const user = userEvent.setup();
    render(<TaskList />);
    await waitFor(() => {
      expect(taskListRegion().getByText('Write quarterly report')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Title'), 'Ship the release notes');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(taskListRegion().getByText('Ship the release notes')).toBeInTheDocument();
    // Controlled input clears after submit — state drives the DOM, not the
    // other way around, so clearing `title` in state is enough.
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });
});
