import { useEffect, useState } from 'react';
import '../styles/themeToggle.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
