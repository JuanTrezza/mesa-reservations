/** @type {import('tailwindcss').Config} */
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

        // Tokens semánticos (tema oscuro cálido + dorado).
        // Todos los pares texto/fondo cumplen WCAG AA (≥ 4.5:1).
        background: '#0F0D0A',
        'on-background': '#F2EBDD',
        surface: '#15120E',
        'surface-dim': '#0B0907',
        'surface-bright': '#2B251D',
        'surface-container-lowest': '#080705',
        'surface-container-low': '#1A1611',
        'surface-container': '#201B15',
        'surface-container-high': '#2A241C',
        'on-surface': '#F2EBDD',
        'on-surface-variant': '#CBC1AF',
        primary: '#D4AF37',
        'on-primary': '#1A1405',
        'primary-container': '#E9C45A',
        'on-primary-container': '#1A1405',
        secondary: '#E3D9C6',
        outline: '#8F8672',
        'outline-variant': '#4D4635',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
