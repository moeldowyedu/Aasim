/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffef7',
          100: '#fffceb',
          200: '#fff8d6',
          300: '#fff3b8',
          400: '#ffed94',
          500: '#ffd60a',
          600: '#f7c600',
          700: '#d4a800',
          800: '#b08900',
          900: '#8a6a00',
        },
        accent: {
          50: '#fffef5',
          100: '#fffbe6',
          200: '#fff5c2',
          300: '#ffed94',
          400: '#ffe566',
          500: '#ffd60a',
          600: '#e6c100',
          700: '#cca800',
          800: '#b38f00',
          900: '#997600',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.7)',
          light: 'rgba(255, 255, 255, 0.5)',
          medium: 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
