/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F9F5',
          100: '#D7EFE4',
          200: '#B2DFC9',
          300: '#83CAA8',
          400: '#4FAF84',
          500: '#2E8B57',
          600: '#247046',
          700: '#1D5A38',
          800: '#1B4D3E', // Primary Forest
          900: '#0F2E22', // Deep Forest Control Center
          950: '#081711', // Deep Space Void
        },
        neon: {
          mint: '#00FF87',
          emerald: '#10B981',
          cyan: '#00F0FF',
          amber: '#FFB800',
          rose: '#FF0055',
          purple: '#B026FF'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        '3d': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.12)',
        '3d-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 255, 135, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-mint': '0 0 25px rgba(0, 255, 135, 0.45)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.55)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.45)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.45)',
      }
    },
  },
  plugins: [],
}
