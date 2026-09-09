# Task Board

A small internal task tracker, and a reference for core React fundamentals —
each concept lives in its own small, commented file under `src/fundamentals/`,
composed together in the real `TaskList` feature rather than left as isolated
demos:

- `ThemeContext.tsx` — `useContext`, avoiding prop drilling
- `SearchInput.tsx` — `useRef` for both DOM access and a mutable
  non-rendering value (debounce timer), plus effect cleanup
- `usePrevious.ts` — a custom hook composing `useRef` + `useEffect`
- `TaskStats.tsx` — `useMemo` for a derived value
- `TaskRow.tsx` — `React.memo`, paired with `useCallback` in `useTasks.ts`

See open PRs for work in progress.
