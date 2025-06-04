/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#2E64A5',
      },
      // screens: {
      //   'landscape': { 'raw': '(orientation: landscape)' },
      // },
    },
  },
  plugins: [],
}