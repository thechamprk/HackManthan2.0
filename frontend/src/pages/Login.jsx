import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

function Login({ onNavigate }) {
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!customerId.trim()) return;

    const params = new URLSearchParams({ customerId: customerId.trim() });
    if (name.trim()) params.set('name', name.trim());

    onNavigate(`/app?${params.toString()}`);
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-left">
          <h1>Welcome Back</h1>
          <p>Login to continue your journey with Hindsight Expert</p>
        </section>

        <section className="login-right">
          <div className="login-topbar">
            <h2>Login</h2>
            <ThemeToggle />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-input-box">
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder=" "
              />
              <label htmlFor="login-name">Name</label>
            </div>

            <div className="login-input-box">
              <input
                id="login-customer"
                type="text"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="login-customer">Customer ID</label>
            </div>

            <div className="login-input-box">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder=" "
              />
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button className="btn-primary login-submit" type="submit">
              Login
            </button>
          </form>

          <div className="login-actions-row">
            <button className="btn-secondary" type="button" onClick={() => onNavigate('/')}>
              Back
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
