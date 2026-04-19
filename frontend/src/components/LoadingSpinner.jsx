function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[var(--teal)]" />
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[var(--teal)] [animation-delay:0.15s]" />
      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[var(--teal)] [animation-delay:0.3s]" />
      {label}
    </div>
  );
}

export default LoadingSpinner;
