/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        brush: ["'Zhi Mang Xing'", "cursive"],
        hand: ["'Long Cang'", "cursive"],
        script: ["'Caveat'", "cursive"],
      },
      colors: {
        ash: "#FAF6F0",
        "ash-deep": "#F0E9E0",
        clay: "#E2D5C5",
        ember: "#E84A2E",
        "ember-dim": "#C2361A",
        kiln: "#1E1712",
        "kiln-light": "#3D3228",
        wheat: "#D4A853",
        "wheat-light": "#E8C878",
        smoke: "#7A6E62",
        "smoke-light": "#A89E94",
        surface: "#F0E9E0",
        border: "#E2D5C5",
      },
      borderRadius: {
        rough: "255px 15px 225px 15px / 15px 225px 15px 255px",
      },
    },
  },
  plugins: [],
};
