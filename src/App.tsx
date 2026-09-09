import { TaskList } from './components/TaskList';
import { ThemeProvider } from './fundamentals/ThemeContext';
import { ThemeToggle } from './fundamentals/ThemeToggle';
import { ErrorBoundary } from './fundamentals/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <main>
        <header>
          <h1>Task Board</h1>
          <ThemeToggle />
        </header>
        {/* If TaskList (or anything under it) throws during render, this
            boundary shows a fallback instead of taking down the whole app —
            the header and theme toggle above stay usable either way. */}
        <ErrorBoundary fallback={<p role="alert">The task board hit a problem. Try reloading.</p>}>
          <TaskList />
        </ErrorBoundary>
      </main>
    </ThemeProvider>
  );
}
