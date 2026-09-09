import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders tasks once loaded', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Write quarterly report')).toBeInTheDocument();
    });
  });

  it('adds a new task via the controlled form', async () => {
    const user = userEvent.setup();
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Write quarterly report')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Title'), 'Ship the release notes');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(screen.getByText('Ship the release notes')).toBeInTheDocument();
    // Controlled input clears after submit — state drives the DOM, not the
    // other way around, so clearing `title` in state is enough.
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });
});
