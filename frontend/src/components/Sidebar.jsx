import { NavLink } from 'react-router-dom';

function Sidebar({ customerId, customerName = 'Guest' }) {
  const query = new URLSearchParams({ customerId, name: customerName }).toString();

  const links = [
    { to: '/app', label: 'Project Hub' },
    { to: '/todo', label: 'AI To-Do' },
    { to: '/grants', label: 'Grants' },
    { to: '/search', label: 'Deep Search' }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">iNSIGHTS</div>
        <div className="sidebar-sub">AI Life OS</div>

        <nav className="sidebar-nav">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={`${item.to}?${query}`}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{customerName}</div>
        <div className="sidebar-user-id">{customerId}</div>
      </div>
    </aside>
  );
}

export default Sidebar;
