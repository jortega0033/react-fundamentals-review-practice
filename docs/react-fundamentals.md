# React fundamentals — a guide for someone who's never used React

This walks through the ideas that everything else in React is built on, in
the order they tend to actually matter when you're reading someone else's
code. Each section links to a real, working example in `src/fundamentals/`
— read the explanation, then open the file and see the same idea in actual
code. Where a concept has a classic, easy-to-make mistake, it's called out
explicitly, because those mistakes are exactly what a code review is
looking for.

## 1. Components and props

A React app is a tree of **components** — plain functions that return
JSX (HTML-looking syntax that's actually JavaScript). A component
receives data from its parent through **props** (short for "properties"),
which are read-only: a component never modifies its own props, only the
parent that passed them down can change what it sends next.

```tsx
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}
```

This is the whole model: data flows down through props, and (as you'll see
below) events flow back up through callback props. There's no built-in way
for a child to reach up and change something in its parent directly — that
one-directional flow is what makes a large React tree possible to reason
about at all. See `src/components/TaskList.tsx` passing `task` and
`onToggle` down to `src/fundamentals/TaskRow.tsx` as a real example.

## 2. Composition — the `children` prop

Every component already has an implicit prop called `children`:
`<Card>stuff</Card>` is really just `<Card children={"stuff"} />`. This is
how React avoids a very deep, very common trap — a wrapper component that
needs a dozen `render*` or `*Content` props just to let its caller
configure every part of its output.

```tsx
function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2>{title}</h2>{children}</section>;
}
// caller writes normal JSX, not a config object:
<Card title="Tasks"><TaskList /></Card>
```

Reach for `children` (or, when a component needs more than one insertion
point, a few distinctly-named `ReactNode` props) any time you'd otherwise
be threading unrelated content through props. See `src/fundamentals/Card.tsx`.

## 3. State — `useState`

Props are how a component receives data. **State** is data a component
owns and can change itself, over time, in response to something (a click,
a keystroke, a network response). `useState` is how a function component
gets a piece of memory that survives between renders:

```tsx
const [count, setCount] = useState(0);
```

The critical thing to internalize: calling `setCount` doesn't just change a
variable — it tells React "re-render this component, and this time `count`
should be the new value." You never assign to `count` directly
(`count = 5` does nothing useful); the setter function is the only way to
change it, and every render sees a fresh, correct snapshot.

**Classic mistake:** starting state with no initial value —
`useState()` instead of `useState('')` — leaves it `undefined`. If that
value later drives a controlled `<input value={...}>`, React logs a
warning the first time it goes from `undefined` to a real string ("a
component is changing an uncontrolled input to be controlled"). Always
give `useState` a real starting value of the correct type.

## 4. Rendering and re-renders

A component re-renders when its own state changes, when its props change,
or when its parent re-renders (which re-renders every child underneath it,
by default, whether or not that child's own props actually changed). This
last part surprises people coming from other frameworks: React does not
automatically skip children just because "nothing relevant changed" —
it re-runs the whole subtree unless you specifically opt out (see
`React.memo` below).

This matters for a review because it's the root cause behind most
performance questions: "why does this re-render so often" almost always
traces back to a parent re-rendering for an unrelated reason, not to
anything wrong with the child itself.

## 5. Rules of Hooks

Every `use*` function (`useState`, `useEffect`, `useRef`, and so on) is a
**Hook**, and hooks follow two rules that aren't optional:

1. **Only call hooks at the top level.** Never inside a condition, a loop,
   or a nested function. `if (x) { useState(0) }` is invalid, even though
   it looks harmless.
2. **Only call hooks from React function components or other custom
   hooks.** Never from a plain function or an event handler.

The reason isn't arbitrary: React tracks hooks by the ORDER they're called
in, not by name, across every render. If a hook call is skipped on some
renders and not others (which a conditional call would do), React loses
track of which piece of state belongs to which `useState` call, and
state silently attaches to the wrong hook. This is genuinely one of the
first things worth checking in an unfamiliar component: is every hook
called unconditionally, every render, in the same order?

## 6. Event handling

Event handlers are just functions passed to props like `onClick`,
`onChange`, `onSubmit`. React wraps the browser's native events in its own
`SyntheticEvent`, which behaves consistently across browsers and is what
you should be using — reaching into the raw browser event should not be
necessary for anything covered here.

```tsx
<button onClick={() => setCount(count + 1)}>Add</button>
```

**Classic mistake:** calling the function instead of passing it —
`onClick={handleClick()}` (with parens) runs `handleClick` immediately,
during render, instead of waiting for a click. Only `onClick={handleClick}`
or `onClick={() => handleClick()}` actually wait for the event.

## 7. Conditional rendering

See `src/fundamentals/ConditionalRendering.tsx` for a worked comparison of
the three common approaches — early return, ternary, and `&&` — including
the specific footgun with `&&`: if the left side is the number `0` (not
`false`), React renders the literal `0` on screen instead of nothing.
`items.length && <List />` is a real, common bug for exactly this reason.

## 8. Fragments

A component must return exactly one root element — but "one element"
doesn't have to mean one extra `<div>` wrapped around everything. A
**Fragment** (`<>...</>`, or `<Fragment key={...}>` when a key is needed)
groups several elements together with no real DOM node of its own. A
stray wrapper div is a common, avoidable source of broken CSS — an
unwanted flex/grid item, an extra layout box nobody asked for — and
unnecessary DOM depth. See `src/fundamentals/TaskSummaryFragment.tsx`.

## 9. Lists and keys

Rendering an array with `.map()` requires a `key` prop on each resulting
element — a string or number that's stable and unique **per item**, not
per position (this is also why mapping to Fragments still needs the
explicit `<Fragment key={...}>` form from the section above, not the bare
`<>` shorthand, which can't take a key at all). React uses the key to
match up elements across renders: with a good key, if item 3 is deleted,
React understands "item 4 is still item 4," and correctly keeps its own
local state (like an open/closed toggle) attached to the right item. With
no key, or with the array *index* as the key, React instead assumes
"whatever is now in position 3 IS position 3," and if the list reorders or
an item is removed, state can silently attach to the wrong row — an
input's contents jumping to a different item, a component not resetting
when its underlying data changed underneath it.

Use a real, stable identifier — a database id, not the index — whenever
the list can reorder, filter, or have items added/removed anywhere but the
end. See `src/components/TaskList.tsx`, keyed on `task.id`.

## 10. Forms and controlled inputs

See `src/fundamentals/ControlledForm.tsx`. A **controlled** input's
displayed value comes from React state (`value={title}`), and every
keystroke writes back into that state (`onChange`) — React is the single
source of truth for what's on screen, which is what makes live validation,
transforming input, or conditionally disabling submit possible.

The alternative is an **uncontrolled** input — no `value` prop, read via a
`ref` only when you actually need it (e.g. on submit). Simpler for a
one-off value nothing else needs to react to live, at the cost of losing
that "state is the source of truth" guarantee. Mixing the two on the same
input (sometimes controlled, sometimes not) is the classic mistake — see
the `useState` section above.

## 11. `useEffect` — side effects

A **side effect** is anything a component does that reaches outside its
own render output: fetching data, subscribing to an event, starting a
timer, manually touching the DOM. `useEffect` is where that code belongs
— never directly in the component body, which can run more often than you
expect and isn't the right place for anything with an external effect.

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup
}, []); // dependency array
```

Two parts matter as much as the effect itself:

- **The dependency array** controls when the effect re-runs. `[]` means
  "once, after the first render." Omitting values the effect actually
  reads is the single most common React bug there is — the effect keeps
  running with a **stale closure**, seeing the value as it was on the
  render that created the closure, not the current one.
- **The cleanup function** (the function an effect can `return`) runs
  before the effect re-runs, and once more when the component unmounts.
  Skipping it for anything that keeps running on its own — an interval, a
  subscription, an event listener — is a real memory/behavior leak: the
  effect keeps firing after the component is gone, sometimes trying to
  update state that no longer exists.

See `src/fundamentals/SearchInput.tsx` for a correctly-cleaned-up debounce
timer, and the review PRs for what a missing cleanup actually looks like.

**Aside — why does my effect run twice in development?** `React.StrictMode`
(wrapping `<App />` in `src/main.tsx`) deliberately mounts, unmounts, and
re-mounts every component once in development only, specifically to
surface an effect that isn't safely repeatable — usually a missing or
incorrect cleanup function. It's not a bug in React; it's React trying to
catch the bug in your effect before your users do. It does not happen in
production builds.

## 12. `useLayoutEffect` vs `useEffect`

Same API, different timing. `useEffect` runs AFTER the browser has
painted the screen — fine for almost everything, and the right default.
`useLayoutEffect` runs BEFORE the browser paints, synchronously, right
after React updates the DOM — it blocks the paint until it finishes.

Reach for `useLayoutEffect` only when you can name the visual flicker
`useEffect`'s later timing would actually cause — typically, measuring a
just-rendered element's real size to immediately position something
relative to it. Using it by default "because it runs sooner" is a
performance mistake: it holds up every single paint for work that, most of
the time, didn't need to block anything. See
`src/fundamentals/MeasuredBadge.tsx`.

## 13. `useRef`

`useRef` returns a mutable box (`{ current: ... }`) that survives across
renders, but — unlike `useState` — changing `.current` does **not**
trigger a re-render. That single fact is the whole concept: `useRef` is
for a value the component needs to remember, but that the JSX doesn't
actually display.

Two genuinely different jobs both go through `useRef`:

1. **A handle to a real DOM node** — `<input ref={inputRef} />` lets you
   call `inputRef.current.focus()` imperatively, something no amount of
   props/state can express declaratively.
2. **A mutable value with no visual representation** — a timer id, a
   previous value for comparison, a flag like "has this already fired."

**Classic mistake:** using `useRef` for a value the UI needs to display.
Since changing `.current` doesn't re-render, the screen shows stale data
even though the ref's real value did update — the fix is always
`useState` instead. See `src/fundamentals/SearchInput.tsx` for both
correct uses side by side, and the review PRs for exactly this mistake (a
counter tracked in a ref, displayed in JSX, that silently never updates on
screen).

## 14. `useContext`

Passing a prop through three or four components that don't use it
themselves, purely so a component further down can read it, is called
**prop drilling**. `useContext` solves it: a `Provider` makes a value
available to its entire subtree, and any descendant can read it directly
with `useContext`, no matter how deep, without every component in between
having to know or care.

```tsx
const ThemeContext = createContext<Theme | null>(null);
// ...
<ThemeContext.Provider value={theme}>
  <DeeplyNestedChild /> {/* can read theme directly */}
</ThemeContext.Provider>
```

Context isn't a wholesale replacement for props — for state only a parent
and its direct children use, plain props stay simpler and easier to trace
(you can see exactly where a prop comes from; a context value could be
provided anywhere above, which is harder to trace by reading alone). Reach
for it specifically when the alternative is drilling through several
uninvolved layers. See `src/fundamentals/ThemeContext.tsx`.

## 15. `useMemo`

`useMemo` caches the RESULT of a computation, recalculating it only when
the values it actually depends on change — not on every render the
component happens to be part of for unrelated reasons.

```tsx
const filtered = useMemo(
  () => items.filter(matchesQuery),
  [items, query],
);
```

**Classic mistake — the opposite direction:** wrapping something genuinely
cheap (a `.length`, a simple ternary) in `useMemo` "just in case." The
memoization itself has a small cost (storing the previous inputs, checking
whether they changed), so for trivial work it adds overhead and noise
without saving anything real. Reach for it when the computation is
actually non-trivial, or when the RESULT'S IDENTITY matters (see
`useCallback` next). See `src/fundamentals/TaskStats.tsx`.

## 16. `useCallback` and `React.memo`

These two exist to solve the same problem together, and rarely make sense
apart from each other.

`React.memo(Component)` skips re-rendering a component when its props are
shallowly equal to last time. But a plain JavaScript function is a new
value every time it's created — `onClick={() => doThing(id)}` creates a
brand-new function on every single render, so a memoized child receiving
it as a prop can never see "the same props as before," and re-renders
anyway. `useCallback` fixes exactly that: it returns the SAME function
reference across renders (as long as its own dependencies haven't
changed), so the memoized child's shallow-equality check actually holds.

```tsx
const handleToggle = useCallback((id: number) => toggle(id), []);
// ...
<MemoizedRow onToggle={handleToggle} /> // same reference every render
```

**Classic mistake:** memoizing the child with `React.memo`, then passing
it a freshly-created inline arrow function anyway — `onToggle={(id) =>
toggleTask(id)}` instead of passing `toggleTask` (already stable via
`useCallback`) directly. The memoization silently does nothing; the
component still re-renders every time, and nothing about it looks broken
unless you know to check. See `src/fundamentals/TaskRow.tsx` +
`src/hooks/useTasks.ts` for the correct pairing, and the review PRs for
this exact mistake introduced.

## 17. Custom hooks

Any function whose name starts with `use` and that calls other hooks
inside it is a **custom hook** — the mechanism for extracting reusable
STATEFUL LOGIC (not UI) out of a component. If you find yourself copying
the same `useState` + `useEffect` pair into two different components,
that pairing usually wants to become its own custom hook instead.

```ts
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
```

A custom hook follows the exact same Rules of Hooks as everything else
(top level only, called unconditionally) — it's not a different category
of thing, just a function that happens to bundle hook calls together. See
`src/fundamentals/usePrevious.ts` and `src/hooks/useTasks.ts`.

## 18. `useReducer`

`useState` is enough for most components. `useReducer` earns its place
once several pieces of state change TOGETHER, in specific, nameable ways
— the tell is a component where multiple `useState` setters have to be
called together, in the same handler, to keep things consistent (e.g.
"changing the status filter should also reset the sort order"). A reducer
collects those transitions into one named list of actions instead of
scattering that coordination across every handler that touches the state.

```ts
type Action = { type: 'SET_STATUS'; status: Status } | { type: 'RESET' };
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATUS': return { ...state, status: action.status };
    case 'RESET': return initialState;
  }
}
const [state, dispatch] = useReducer(reducer, initialState);
```

**Classic mistake:** mutating `state` directly inside the reducer instead
of returning a new object (`state.status = action.status; return state;`).
React compares the OLD and NEW state by reference to decide whether to
re-render — mutating in place means the reference never changes, so React
concludes "nothing happened" and silently skips the re-render, even though
the underlying object did change. Every branch of a reducer must return a
new value, never mutate and return the same one.

It's not a wholesale `useState` replacement either — one independent value
(a search box's text, a modal's open/closed flag) stays simpler as its own
`useState`. See `src/fundamentals/useTaskFilters.ts`, wired into the real
status/sort controls in `src/components/TaskList.tsx`.

## 19. Error boundaries

The one place a class component still matters — there's no hook
equivalent, because catching a render error requires
`static getDerivedStateFromError` and `componentDidCatch`, which only
exist on classes. An error boundary catches a JavaScript error thrown
during render, in a lifecycle method, or in a constructor, anywhere in its
child tree, so one crashing component takes down only itself instead of
the whole app.

It does **not** catch errors in event handlers (those need a normal
try/catch), errors in async code (a rejected promise), or an error in the
boundary's own render method. See `src/fundamentals/ErrorBoundary.tsx`.

## Reading this repo's practice PRs

Every mistake named above ("classic mistake: ...") appears at least once,
for real, somewhere in this repo's open pull requests — deliberately, and
without being called out in the PR description. That's the point: a real
code review means recognizing these patterns on sight in code you've never
seen before, the same way you'd recognize them here now that they're
named. Go find them.
