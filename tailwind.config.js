/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        up: '#FF4D4F',
        down: '#52C41A',
        bg: {
          primary: '#0F0F0F',
          card: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}
