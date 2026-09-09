import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders tasks once loaded', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Write quarterly report')).toBeInTheDocument();
    });
  });
});
