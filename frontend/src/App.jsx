import { Component } from 'react';
import Home from './pages/Home';

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

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-app-gradient">
        <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">HackManthan Project</p>
              <h1 className="text-2xl font-black text-slate-900">HindsightHub</h1>
            </div>
            <p className="text-sm text-slate-600">AI Support Agent with Persistent Memory</p>
          </div>
        </header>
        <Home />
      </div>
    </ErrorBoundary>
  );
}

export default App;
