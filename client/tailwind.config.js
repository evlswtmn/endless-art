/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff006e',
          purple: '#8338ec',
          blue: '#3a86ff',
          green: '#06ffa5',
        }
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
