import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const storedTheme = typeof window !== 'undefined'
  ? localStorage.getItem('theme') || 'light'
  : 'light';

document.documentElement.setAttribute('data-theme', storedTheme);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
