import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * useContext — avoids prop drilling for state many components at different
 * depths need to read. Reach for context when the same value would
 * otherwise need to be threaded through 3+ intermediate components that
 * don't use it themselves. For state only a parent and its direct children
 * care about, plain props are simpler and easier to trace.
 */
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Throwing on a missing provider, instead of returning a default value,
// turns "used outside its provider" into an immediate, obvious error at the
// call site rather than a silent wrong-theme bug discovered later.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
