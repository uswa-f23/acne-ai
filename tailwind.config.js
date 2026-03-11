/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Feminine pastel color palette
        primary: {
          50: '#fff5f9',
          100: '#ffe9f3',
          200: '#ffd4e5',
          300: '#ffb8d2',
          400: '#ff9ec5',
          500: '#ff7bb0',
          600: '#f05099',
          700: '#d63384',
          800: '#b01e68',
          900: '#8b1655',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fececa',
          300: '#fdaba5',
          400: '#fb7a71',
          500: '#f25246',
          600: '#df3730',
          700: '#bc2721',
          800: '#9c231f',
          900: '#82211f',
        },
        neutral: {
          50: '#faf7f5',
          100: '#f5f1ed',
          200: '#e8dfd7',
          300: '#d9cdc1',
          400: '#bba89a',
          500: '#9d8373',
          600: '#7d6659',
          700: '#655349',
          800: '#54453e',
          900: '#483b35',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Quicksand', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(255, 158, 197, 0.1)',
        'soft-lg': '0 8px 30px rgba(255, 158, 197, 0.15)',
        'soft-xl': '0 20px 50px rgba(255, 158, 197, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideInLeft': 'slideInLeft 0.6s ease-out',
        'slideInRight': 'slideInRight 0.6s ease-out',
        'scaleIn': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}