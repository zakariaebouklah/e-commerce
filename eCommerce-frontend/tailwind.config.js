/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        '3xl': '0 3px 10px rgb(0 0 0 / 0.2)',
        'toggle': 'inset 2px -2px 0 1.8px #fff',
        'inDark': '2px -3px 0px rgb(255 255 255 / 0.7)',
        'inLight': '2px -3px 0px rgb(0 0 0 / 0.7)'
      },
      fontFamily: {
        'script': ['League Script', 'cursive'],
        'domain': ['Open Sans', 'sans-serif']
      },
      colors: {
        'grn': "#48BB78",
        'org': "#33546C",
        'ble': "#021639",
        'gan': "#D31336",
        'dark': "#252131"
      },
      animation: {
        'rotation': 'spinner 2s ease-in-out infinite',
        'anima1': 'anima1 0.3s linear',
        'anima2': 'anima2 0.3s linear',
        'heart': 'heartbeat 1.5s infinite'
      },
      keyframes: {
        anima1: {
          '0%': { transform: 'translateX(1.5em)' },
          '80%': { transform: 'translateX(-0.3em)' },
          '100%': { transform: 'translateX(0em)' },
        },
        heartbeat: {
          '0%, 100%': {transform: 'scale(1)'},
          '50%': {transform: 'scale(1.2)'}
        },
        anima2: {
          '0%': { transform: 'translateX(0px)' },
          '80%': { transform: 'translateX(1.6em)' },
          '100%': { transform: 'translateX(1.4em)' },
        },
        spinner: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
