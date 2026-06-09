export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mesa-gold': '#D4AF37',
        'mesa-cream': '#F5F1E8',
        'mesa-white': '#E8E4D9',
        'mesa-gray': '#8B8680',
        'mesa-black': '#0E0E0E',
        'mesa-surface': '#1A1A1A',
        'mesa-elevated': '#242424',
        'mesa-green': '#4A7C59',
        'mesa-red': '#8B3A3A',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
