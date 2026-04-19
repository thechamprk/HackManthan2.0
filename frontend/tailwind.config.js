/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#0f172a',
          ocean: '#0ea5e9',
          mint: '#14b8a6',
          sunrise: '#f59e0b',
          cloud: '#f8fafc'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.12)'
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        rise: 'rise 420ms ease-out both'
      }
    }
  },
  plugins: []
};
