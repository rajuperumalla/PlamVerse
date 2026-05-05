/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cosmos: {
          900: "#05021a",
          800: "#0a0420",
          700: "#120833",
          600: "#1c1247",
          500: "#2a1c66",
        },
        nebula: {
          pink: "#ff4dd2",
          purple: "#7c3aed",
          violet: "#a855f7",
          blue: "#3b82f6",
          cyan: "#22d3ee",
          neon: "#00f0ff",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.12)",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel_600SemiBold"],
        raleway: ["Raleway_400Regular"],
        "raleway-bold": ["Raleway_700Bold"],
      },
    },
  },
  plugins: [],
};
