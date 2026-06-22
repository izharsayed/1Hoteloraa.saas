/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C054',
          pale: '#FAF7EE',
        },
        cream: '#FEF9F1',
        charcoal: '#1F2933',
        slate: '#6B7280',
        success: {
          DEFAULT: '#1E9E6A',
          pale: '#EAF8F2',
        },
        danger: {
          DEFAULT: '#D94A4A',
          pale: '#FDF2F2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          pale: '#FEF7E6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          linen: '#F4EFE6',
        },
        border: {
          cream: '#EBE5DA',
        }
      },
      fontFamily: {
        display: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        fadeIn:  'fadeIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}

