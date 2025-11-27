/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Baris ini memberitahu Tailwind untuk memindai semua file di dalam folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}