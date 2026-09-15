/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7a2808ff',
        //primary: '#0d5c26',
        secondary: '#f0f8e0',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.5rem',
        'DEFAULT': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
        '3xl': '5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}