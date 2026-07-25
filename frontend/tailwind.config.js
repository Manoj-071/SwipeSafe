/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          navy: '#0b132b',
          blue: '#1c2541',
          indigo: '#3a506b',
          teal: '#5bc0be',
          cyan: '#6fffe9',
        },
        verdict: {
          safe: '#10b981',    // Emerald green
          caution: '#f59e0b', // Amber yellow
          risky: '#ef4444',   // Red
          blocked: '#6b7280'  // Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
