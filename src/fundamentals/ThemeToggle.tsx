import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Theme: {theme} (click to toggle)
    </button>
  );
}
