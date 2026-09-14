/** @type {import('tailwindcss').Config} */
const baseConfig = require('../shared/tailwind-base');

module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
    },
  },
  plugins: [],
};
