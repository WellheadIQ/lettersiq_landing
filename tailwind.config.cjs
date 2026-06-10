/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Monitoring Console palette
        ink: "#0C0D0F",
        inkPanel: "#15171A",
        inkSoft: "#1D2024",
        paper: "#FAF8F4",
        paperAlt: "#F1EEE7",
        paperPanel: "#FFFFFF",
        ember: "#E0560E",
        emberBright: "#F97316",
        emberSoft: "rgba(224,86,14,0.10)",
        steel: "#3F6F8F",

        // Semantic aliases mapped to the refreshed palette
        // (keeps existing class names consistent everywhere)
        labBg: "#FAF8F4",
        labBgAlt: "#F1EEE7",
        labFg: "#0C0D0F",
        labFgMuted: "#57534E",
        labAccent: "#E0560E",
        labAlert: "#F97316",
        labBorder: "rgba(12,13,15,0.10)",
        labBorderStrong: "rgba(12,13,15,0.20)",

        // Legacy (kept for compatibility during migration)
        customPrimary: "rgb(99, 102, 241)",
        customSecondary: "rgb(161, 163, 247)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        Inter: "Inter",
      },
      fontSize: {
        "display-sm": ["clamp(2.25rem, 6vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display": ["clamp(2.75rem, 7vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(3rem, 9vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
      },
      maxWidth: {
        content: "80rem",
      },
      opacity: {
        3: "0.03",
        8: "0.08",
        15: "0.15",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        85: "0.85",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(12,13,15,0.04), 0 12px 40px -12px rgba(12,13,15,0.18)",
        panelLg: "0 1px 2px rgba(12,13,15,0.05), 0 30px 80px -24px rgba(12,13,15,0.28)",
        emberGlow: "0 18px 50px -18px rgba(224,86,14,0.55)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        sweep: "sweep 2.6s ease-in-out infinite",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xll: "1400px",
        "2xl": "1536px",
      },
    },
  },
};
