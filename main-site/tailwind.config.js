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
      colors: {
        ...baseConfig.theme.extend.colors,
        // Primary: Forest Green — brand accent for CTAs, active states, key details
        primary: {
          50:  '#f0f7f1',
          100: '#daeede',
          200: '#b7dfbe',
          300: '#87c895',
          400: '#4fa861',
          500: '#2b843f',
          600: '#1e6d32',
          700: '#175727', // core brand forest green
          800: '#134720',
          900: '#0e3819',
          950: '#07200e',
        },
        // Neutral: Blue-Black — core typography, dark backgrounds, high-contrast framing
        neutral: {
          50:  '#f8fafb',
          100: '#f0f3f6',
          200: '#e2e7ec',
          300: '#c5d0da',
          400: '#8f9ea9',
          500: '#647482',
          600: '#475564',
          700: '#33404e',
          800: '#1e2936',
          900: '#131d27',
          950: '#0a1118', // deep blue-black anchor
        },
        // Map accent to forest green variants so legacy references stay within palette
        accent: {
          50:  '#f0f7f1',
          100: '#daeede',
          200: '#b7dfbe',
          300: '#87c895',
          400: '#4fa861',
          500: '#2b843f',
          600: '#1e6d32',
          700: '#175727',
          800: '#134720',
          900: '#0e3819',
          950: '#07200e',
        },
      },
      borderRadius: {
        none: '0',
        xs:   '2px',
        sm:   '3px',
        DEFAULT: '4px',
        md:   '6px',
        lg:   '8px',
        xl:   '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(10, 17, 24, 0.04)',
        'lift':   '0 4px 20px -2px rgba(10, 17, 24, 0.08)',
        'elevate':'0 12px 32px -4px rgba(10, 17, 24, 0.12)',
      },
    },
  },
  plugins: [],
};
