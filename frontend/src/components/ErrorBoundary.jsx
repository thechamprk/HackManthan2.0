import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown UI error' };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] UI crash', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto mt-12 max-w-xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm">{this.state.message}</p>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
