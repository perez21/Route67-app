import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16233F",
        ink2: "#1F3159",
        parchment: "#F2ECDD",
        parchment2: "#E9DFC8",
        gold: "#C89B3C",
        gold2: "#E4B85B",
        forest: "#2F5233",
        rust: "#A8461F",
        charcoal: "#21201C",
        // Palette Cameroun — utilisée en accents (liseré, bandeau, badges),
        // jamais en aplat massif, pour rester lisible et professionnel.
        cmr: {
          green: "#007A5E",
          greenDeep: "#00563F",
          red: "#CE1126",
          yellow: "#FCD116",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        fadeUp: "fadeUp 0.5s ease-out both",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
