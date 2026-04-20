import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

function Login({ onNavigate }) {
  const [authMode, setAuthMode] = useState('signin');
  const [signinName, setSigninName] = useState('');
  const [signinCustomerId, setSigninCustomerId] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCustomerId, setSignupCustomerId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  function handleSignIn(event) {
    event.preventDefault();
    if (!signinCustomerId.trim()) return;

    const params = new URLSearchParams({ customerId: signinCustomerId.trim() });
    if (signinName.trim()) params.set('name', signinName.trim());

    onNavigate(`/app?${params.toString()}`);
  }

  function handleSignUp(event) {
    event.preventDefault();
    if (!signupCustomerId.trim()) return;

    const params = new URLSearchParams({ customerId: signupCustomerId.trim() });
    if (signupName.trim()) params.set('name', signupName.trim());

    setSigninName(signupName.trim());
    setSigninCustomerId(signupCustomerId.trim());
    setSigninPassword(signupPassword);
    setAuthMode('signin');

    if (signupEmail.trim()) {
      // No backend account API yet; continue with created profile locally.
      onNavigate(`/app?${params.toString()}`);
    }
  }

  const isSignIn = authMode === 'signin';

  function switchTo(mode) {
    setAuthMode(mode);
    setShowSigninPassword(false);
    setShowSignupPassword(false);
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-left">
          <h1>{isSignIn ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p>
            {isSignIn
              ? 'Sign in to continue your journey with Hindsight Expert'
              : 'Sign up to start using memory-powered support workflows'}
          </p>

          <div className="login-left-switch">
            <p>{isSignIn ? 'New here?' : 'Already have an account?'}</p>
            <button
              type="button"
              className="btn-secondary login-left-switch-btn"
              onClick={() => switchTo(isSignIn ? 'signup' : 'signin')}
            >
              {isSignIn ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>
        </section>

        <section className="login-right">
          <div className="login-topbar">
            <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
            <ThemeToggle />
          </div>

          <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={isSignIn}
              className={`auth-mode-btn ${isSignIn ? 'active' : ''}`}
              onClick={() => switchTo('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isSignIn}
              className={`auth-mode-btn ${!isSignIn ? 'active' : ''}`}
              onClick={() => switchTo('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className={`auth-form-stage ${isSignIn ? 'show-signin' : 'show-signup'}`}>
            <form className="auth-form auth-form-signin" onSubmit={handleSignIn}>
              <div className="login-input-box">
                <input
                  id="signin-name"
                  type="text"
                  value={signinName}
                  onChange={(event) => setSigninName(event.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signin-name">Name</label>
              </div>

              <div className="login-input-box">
                <input
                  id="signin-customer"
                  type="text"
                  value={signinCustomerId}
                  onChange={(event) => setSigninCustomerId(event.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="signin-customer">Customer ID</label>
              </div>

              <div className="login-input-box">
                <input
                  id="signin-password"
                  type={showSigninPassword ? 'text' : 'password'}
                  value={signinPassword}
                  onChange={(event) => setSigninPassword(event.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signin-password">Password</label>
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowSigninPassword((prev) => !prev)}
                  aria-label={showSigninPassword ? 'Hide password' : 'Show password'}
                >
                  {showSigninPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button className="btn-primary login-submit" type="submit">
                Sign In
              </button>

              <p className="login-mode-hint">
                New here?{' '}
                <button type="button" className="login-inline-link" onClick={() => switchTo('signup')}>
                  Sign up here
                </button>
              </p>
            </form>

            <form className="auth-form auth-form-signup" onSubmit={handleSignUp}>
              <div className="login-input-box">
                <input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="signup-name">Full Name</label>
              </div>

              <div className="login-input-box">
                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="signup-email">Email</label>
              </div>

              <div className="login-input-box">
                <input
                  id="signup-customer"
                  type="text"
                  value={signupCustomerId}
                  onChange={(event) => setSignupCustomerId(event.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="signup-customer">Customer ID</label>
              </div>

              <div className="login-input-box">
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="signup-password">Create Password</label>
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button className="btn-primary login-submit" type="submit">
                Create Account
              </button>

              <p className="login-mode-hint">
                Already have an account?{' '}
                <button type="button" className="login-inline-link" onClick={() => switchTo('signin')}>
                  Sign in here
                </button>
              </p>
            </form>
          </div>

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
