/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4f0',
          100: '#ffe8e0',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4f24',
          900: '#1E2A38',
        },
        accent: {
          50: '#f8fafc',
          100: '#F4F5F7',
          500: '#A0A4A8',
          600: '#1E2A38',
        },
        nexo: {
          orange: '#FF6B35',
          navy: '#1E2A38',
          lightGray: '#F4F5F7',
          mediumGray: '#A0A4A8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}