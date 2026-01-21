/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Brand Colors (from app_colors.dart)
        'tech-blue': '#007ACC',      // Blue Circle (Correct)
        'caution-amber': '#FFC72C',  // Yellow Triangle (Present)

        // The Dark Mode UI Colors
        'reddit-dark': '#121212',    // Main Background
        'flex-gray': '#1E1E1E',      // Card/Surface Background
        'wrong-dark': '#3A3A3A',     // Dark Gray Square (Absent)
      },
      fontFamily: {
        // Matches the 'RobotoMono' look from your Dart theme
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}