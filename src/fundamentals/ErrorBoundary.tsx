import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Error boundaries — the one place a class component still matters. There
 * is no hook equivalent (no "useErrorBoundary"): catching a render error
 * requires the class lifecycle methods below, specifically
 * getDerivedStateFromError and componentDidCatch. This is a deliberate,
 * narrow exception, not evidence that "hooks can't do everything class
 * components can" — everything else in this repo is a function component.
 *
 * What it catches: a JavaScript error thrown DURING RENDER, in a lifecycle
 * method, or in a constructor, anywhere in its child tree — one crashing
 * component takes down only itself, not the whole app.
 *
 * What it does NOT catch: errors in event handlers (a broken onClick just
 * needs a normal try/catch), errors in async code (a rejected fetch
 * promise), errors during server-side rendering, or an error thrown in the
 * boundary's own render method.
 */
interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
