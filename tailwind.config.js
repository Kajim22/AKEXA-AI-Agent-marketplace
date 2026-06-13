/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          500: '#4f6ef7',
          600: '#3a57e8',
          700: '#2c44cc',
          900: '#1a2b80',
        },
        surface: {
          50:  '#f8f9fc',
          100: '#f0f2f8',
          800: '#1c1f2e',
          900: '#13151f',
        }
      },
    },
  },
  plugins: [],
}
