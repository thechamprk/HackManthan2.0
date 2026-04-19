import { ROUTES } from '../utils/constants';

function Header({ customerName = 'Guest', onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(10,10,15,0.75)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6 lg:px-8">
        <div>
          <h1 className="font-heading text-2xl font-extrabold">HindsightHub</h1>
          <p className="text-xs text-slate-400">AI Support with Persistent Memory</p>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <button className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-white/10" onClick={() => onNavigate(ROUTES.HOME)} type="button">Chat</button>
          <button className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-white/10" onClick={() => onNavigate(ROUTES.DASHBOARD)} type="button">Dashboard</button>
          <button className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-white/10" onClick={() => onNavigate(ROUTES.DOCS)} type="button">Docs</button>
        </nav>
        <div className="flex items-center gap-3 text-sm text-slate-200">
          <span>{customerName}</span>
          <span className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Live
          </span>
          <button
            type="button"
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
