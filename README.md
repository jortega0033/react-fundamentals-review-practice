# Task Board

A small internal task tracker, and a working reference for core React
fundamentals. Start with **[`docs/react-fundamentals.md`](docs/react-fundamentals.md)**
— a guide written for someone who's never used React, explaining each
concept below and linking to the real code that demonstrates it.

- `fundamentals/ThemeContext.tsx` — `useContext`, avoiding prop drilling
- `fundamentals/SearchInput.tsx` — `useRef` for DOM access AND a mutable
  non-rendering value (debounce timer), plus effect cleanup
- `fundamentals/usePrevious.ts` — a custom hook composing `useRef` + `useEffect`
- `fundamentals/TaskStats.tsx` — `useMemo` for a derived value
- `fundamentals/TaskRow.tsx` + `hooks/useTasks.ts` — `React.memo` paired
  with `useCallback`
- `fundamentals/ControlledForm.tsx` — controlled inputs, a real form
- `fundamentals/ConditionalRendering.tsx` — early return vs ternary vs `&&`
- `fundamentals/useTaskFilters.ts` — `useReducer`, and when it earns its
  place over several `useState` calls
- `fundamentals/ErrorBoundary.tsx` — the one place a class component still
  matters

See open PRs for work in progress — every "classic mistake" the guide
names shows up for real, at least once, somewhere in the open PR, without
being called out. That's the practice.
