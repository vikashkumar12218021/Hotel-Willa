/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0b3b60',
          accent: '#f4a261',
          muted: '#143b52',
        },
      },
    },
  },
  plugins: [],
}

