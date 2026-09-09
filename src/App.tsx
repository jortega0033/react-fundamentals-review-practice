import { TaskList } from './components/TaskList';
import { ThemeProvider } from './fundamentals/ThemeContext';
import { ThemeToggle } from './fundamentals/ThemeToggle';

export default function App() {
  return (
    <ThemeProvider>
      <main>
        <header>
          <h1>Task Board</h1>
          <ThemeToggle />
        </header>
        <TaskList />
      </main>
    </ThemeProvider>
  );
}
