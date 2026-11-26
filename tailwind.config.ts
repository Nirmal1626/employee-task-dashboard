import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#142033',
        mist: '#f3f5f8',
        line: '#e3e8ef',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
