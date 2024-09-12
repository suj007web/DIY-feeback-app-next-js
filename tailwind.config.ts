import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'gray-900': '#121212',
        'gray-800': '#1e1e1e',
        'gray-700': '#2d2d2d',
      },
      textColor: {
        'white': '#ffffff',
        'gray-300': '#d1d5db',
      },
    },
  },
  plugins: [],
};

export default config;