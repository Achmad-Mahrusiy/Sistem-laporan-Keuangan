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
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}