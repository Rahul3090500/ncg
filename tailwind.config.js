/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ncg-dark': '#000F19',
        'ncg-blue': '#488bf3',
        'blue': '#488bf3',
        'ncg-light-blue': '#589AFF',
        'ncg-gray': '#060608',
        'ncg-light-gray': '#F4F7FF',
        'ncg-very-light-blue': '#E7F5FF',
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'sans': ['Manrope', 'sans-serif'], // Make Manrope the default sans font
      },
      maxWidth: {
        'container': '1512px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
