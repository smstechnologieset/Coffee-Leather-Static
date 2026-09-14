/** @type {import('tailwindcss').Config} */

// Highland Roots Trading PLC — shared Tailwind base config
// All three Next.js apps extend this. Override tokens per-app by passing
// them in the app-level tailwind.config.ts `theme.extend`.
module.exports = {
  theme: {
    extend: {
      colors: {
        // ── Brand palette (MOCK — will be replaced when client confirms) ──────
        // Primary: warm amber/gold — evokes Ethiopian coffee, earth, leather
        primary: {
          50:  '#fdf8ee',
          100: '#faefd3',
          200: '#f5dba3',
          300: '#efc26c',
          400: '#e8a43d',
          500: '#c8860a', // brand base
          600: '#a86c08',
          700: '#87530a',
          800: '#6e420f',
          900: '#5b3710',
          950: '#331c06',
        },
        // Accent: deep forest green — Ethiopian highlands
        accent: {
          50:  '#f0f7ea',
          100: '#dcecd1',
          200: '#bcdbaa',
          300: '#91c277',
          400: '#6aa84f',
          500: '#4d8c35',
          600: '#396e27',
          700: '#2d5016', // brand base
          800: '#274420',
          900: '#223b1d',
          950: '#0e1f0a',
        },
        // Neutral: warm slate — not cold blue-gray
        neutral: {
          50:  '#f9f7f5',
          100: '#f0ece7',
          200: '#e1d8cf',
          300: '#ccc0b3',
          400: '#b3a292',
          500: '#9a8878',
          600: '#7d6e60',
          700: '#655a4e',
          800: '#544c43',
          900: '#47413a',
          950: '#26221e',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(200,134,10,0.12)',
        'brand':    '0 4px 16px 0 rgba(200,134,10,0.15)',
        'brand-lg': '0 10px 40px 0 rgba(200,134,10,0.18)',
      },
    },
  },
  plugins: [],
};
