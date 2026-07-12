/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F2',
        ink: '#1B2521',
        forest: {
          DEFAULT: '#0F6B4C',
          dark: '#0B5139',
          light: '#E4EFE7',
        },
        clay: {
          DEFAULT: '#A6472B',
          light: '#F4E4DE',
        },
        rule: '#DAD5C6',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}