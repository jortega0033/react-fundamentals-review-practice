export interface Task {
  id: number;
  title: string;
  done: boolean;
  ownerEmail: string;
}

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Write quarterly report', done: false, ownerEmail: 'alice@example.com' },
  { id: 2, title: 'Review pull requests', done: true, ownerEmail: 'bob@example.com' },
  { id: 3, title: 'Update onboarding docs', done: false, ownerEmail: 'carol@example.com' },
];

export async function fetchTasks(): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_TASKS;
}
