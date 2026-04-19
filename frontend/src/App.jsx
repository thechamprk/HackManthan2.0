import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Todo from './pages/Todo';
import Grants from './pages/Grants';
import Search from './pages/Search';
import Sidebar from './components/Sidebar';

function ProtectedLayout({ children }) {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('name') || 'Guest';

  if (!customerId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="authed-layout">
      <Sidebar customerId={customerId} customerName={customerName} />
      <main className="authed-main">{children}</main>
    </div>
  );
}

function RouteGuard({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return children;
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

function AppRoutes() {
  return (
    <RouteGuard>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/grants" element={<Grants />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RouteGuard>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
