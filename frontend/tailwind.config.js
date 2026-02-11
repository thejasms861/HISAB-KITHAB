/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#09090b', // zinc-950
          card: '#18181b', // zinc-900
          border: '#27272a', // zinc-800
          text: '#ffffff',
          'text-secondary': '#a1a1aa', // zinc-400
          orange: '#FF5722',
          'orange-hover': '#F4511E',
        }
      }
    },
  },
  plugins: [],
}
