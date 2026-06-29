/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        // Palette pulled from the reference images (golden-hour).
        sky: {
          core: '#fff7e6', // sun bloom core
          warm: '#f6ead0', // pale cream near sun
          honey: '#e8b96a', // mid amber
          amber: '#d9974a', // deeper warm edge
        },
        branch: {
          black: '#0e0c08', // deepest backlit limb
          dark: '#1a140d', // limb body
          rim: '#f0c074', // warm rim-light on edges
        },
        moss: {
          lit: '#7c8a44',
          mid: '#4a5a2c',
          deep: '#283621',
        },
        bark: {
          DEFAULT: '#7d4a30',
          shadow: '#3c241a',
        },
        floor: {
          water: '#1c2530',
          glint: '#b56a24',
          stone: '#574a3c',
          moss: '#5e6b34',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
