import { useReducer } from 'react';

/**
 * useReducer — the right tool once related pieces of state start changing
 * TOGETHER, in specific, nameable ways. The tell: several useState calls
 * where half your setters have to call two or three of them in the same
 * handler to keep everything consistent. A reducer collects those
 * transitions into one named list (the action types below) instead of
 * scattering "and also reset the sort order" logic across every place
 * that touches status.
 *
 * Not a wholesale useState replacement — a single independent value (a
 * search query, an open/closed flag) stays simpler as its own useState.
 * Reach for useReducer when the STATE SHAPE is one thing with several
 * fields that move together, not several unrelated things that happen to
 * live in the same component.
 */
type StatusFilter = 'all' | 'done' | 'pending';
type SortOrder = 'newest' | 'oldest';

interface FilterState {
  status: StatusFilter;
  sortOrder: SortOrder;
}

type FilterAction =
  | { type: 'SET_STATUS'; status: StatusFilter }
  | { type: 'SET_SORT'; sortOrder: SortOrder }
  | { type: 'RESET' };

const initialState: FilterState = { status: 'all', sortOrder: 'newest' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_SORT':
      return { ...state, sortOrder: action.sortOrder };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useTaskFilters() {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return {
    status: state.status,
    sortOrder: state.sortOrder,
    setStatus: (status: StatusFilter) => dispatch({ type: 'SET_STATUS', status }),
    setSortOrder: (sortOrder: SortOrder) => dispatch({ type: 'SET_SORT', sortOrder }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
