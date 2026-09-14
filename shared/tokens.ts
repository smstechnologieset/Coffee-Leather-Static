/**
 * shared/tokens.ts
 * TypeScript re-export of brand tokens for use in non-Tailwind contexts
 * (e.g., inline styles, canvas drawing, chart theming).
 *
 * MOCK: colors will be replaced when the client confirms the real brand palette.
 */

export const colors = {
  primary: {
    50:  '#fdf8ee',
    100: '#faefd3',
    200: '#f5dba3',
    300: '#efc26c',
    400: '#e8a43d',
    500: '#c8860a',
    600: '#a86c08',
    700: '#87530a',
    800: '#6e420f',
    900: '#5b3710',
    950: '#331c06',
  },
  accent: {
    50:  '#f0f7ea',
    100: '#dcecd1',
    200: '#bcdbaa',
    300: '#91c277',
    400: '#6aa84f',
    500: '#4d8c35',
    600: '#396e27',
    700: '#2d5016',
    800: '#274420',
    900: '#223b1d',
    950: '#0e1f0a',
  },
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
} as const;

export const fontFamily = {
  sans:  'Inter, ui-sans-serif, system-ui, sans-serif',
  serif: 'Playfair Display, ui-serif, Georgia, serif',
} as const;
