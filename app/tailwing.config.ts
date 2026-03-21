import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'; // Add this

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Add this plugin block
    plugin(function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.translate-z-30': {
          transform: 'translateZ(30px)',
        },
        '.translate-z-50': {
          transform: 'translateZ(50px)',
        },
      })
    })
  ],
};
export default config;