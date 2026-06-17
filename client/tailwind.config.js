/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1F4A', light: '#1A3466', lighter: '#2A4A8A' },
        gold: { DEFAULT: '#D4A017', light: '#F5C842' },
        teal: { DEFAULT: '#0E8A7A', light: '#13A895' },
        cream: '#F8F7F4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
