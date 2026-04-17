/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          ivory: "#fcf9f4",
          "ivory-low": "#f6f3ee",
          charcoal: "#1c1c19",
          gold: "#705b3b",
          "gold-light": "#fbdeb5",
          charcoal_deep: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#000000",
          container: "#1c1b1b",
        },
        surface: {
          DEFAULT: "#fcf9f4",
          low: "#f6f3ee",
          lowest: "#ffffff",
          container: "#f0ede8",
          high: "#ebe8e3",
          highest: "#e5e2dd",
          dim: "#dcdad5",
          variant: "#e5e2dd",
        },
        on: {
          surface: "#1c1c19",
          background: "#1c1c19",
          primary: "#ffffff",
        }
      },
      fontFamily: {
        serif: ["'Noto Serif'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        none: "0",
      },
      spacing: {
        '18': '4.5rem',
      },
      backdropBlur: {
        luxury: '20px',
      }
    },
  },
  plugins: [],
}
