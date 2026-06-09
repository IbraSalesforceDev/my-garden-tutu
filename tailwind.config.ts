import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        huerto: {
          50: '#f1f8f1',
          100: '#dcefdc',
          200: '#bbdfbb',
          300: '#8ec98e',
          400: '#5aab5a',
          500: '#3a8c3a',
          600: '#2c6f2c',
          700: '#255925',
          800: '#1f471f',
          900: '#1a3b1a',
        },
        tierra: {
          400: '#c9a27a',
          600: '#8a5a2b',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
