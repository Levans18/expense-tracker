/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        keyframes: {
          'bounce-x': {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(-10px)' },
          },
        },
        animation: {
          'bounce-x': 'bounce-x 1s infinite',
        },
      },
    },
    plugins: [],
  }