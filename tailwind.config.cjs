/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // Lone Star instrument-panel palette — red / white / blue
        // ============================================================
        parchment: "#F7F5F0", // page canvas (warm paper white)
        parchmentAlt: "#EFEBE2", // alternating light band
        card: "#FFFFFF", // card surface, one tier above canvas
        oxford: "#0A1428", // dark instrument sections + ink on light
        midnight: "#060D1B", // deepest navy: hero stage, footer
        slateNavy: "#132340", // elevated navy panel on dark

        signalRed: "#C8102E", // rationed accent: CTA, critical, active, closing band
        signalBright: "#E8354F", // brighter red for hover/alert glow
        signalSoft: "rgba(200,16,46,0.10)", // soft red wash for badges

        cobalt: "#1F4FFF", // secondary voice: links, info, chart lines
        unionBlue: "#0A3161", // deep blue linework / info-deep
        cobaltSoft: "rgba(31,79,255,0.10)",

        starWhite: "#FAFBFF", // text on dark

        // Neutral ink ramp (navy-biased)
        ink: "#0A1428",
        inkMuted: "#4A5568",
        inkFaint: "#8A94A6",

        // Hairlines
        line: "rgba(10,20,40,0.12)", // on light
        lineStrong: "rgba(10,20,40,0.22)",
        lineDark: "rgba(250,251,255,0.14)", // on dark
        lineDarkStrong: "rgba(250,251,255,0.28)",

        // ------------------------------------------------------------
        // Semantic aliases (keep legacy class names resolving to the
        // refreshed palette so nothing renders undefined mid-migration)
        // ------------------------------------------------------------
        paper: "#F7F5F0",
        paperAlt: "#EFEBE2",
        paperPanel: "#FFFFFF",
        ember: "#C8102E",
        emberBright: "#E8354F",
        emberSoft: "rgba(200,16,46,0.10)",
        steel: "#1F4FFF",
        labBg: "#F7F5F0",
        labBgAlt: "#EFEBE2",
        labFg: "#0A1428",
        labFgMuted: "#4A5568",
        labAccent: "#C8102E",
        labAlert: "#E8354F",
        labBorder: "rgba(10,20,40,0.12)",
        labBorderStrong: "rgba(10,20,40,0.22)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Archivo", "Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        Inter: "Inter",
      },
      fontSize: {
        "display-sm": ["clamp(2.25rem, 6vw, 3.25rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        display: ["clamp(2.75rem, 7.5vw, 5rem)", { lineHeight: "0.94", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(3rem, 9.5vw, 6.5rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
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
        // Shadows are used sparingly; hierarchy is hairline + surface step
        panel: "0 1px 2px rgba(10,20,40,0.05), 0 14px 44px -18px rgba(10,20,40,0.22)",
        panelLg: "0 1px 2px rgba(10,20,40,0.06), 0 34px 90px -28px rgba(10,20,40,0.32)",
        redGlow: "0 16px 44px -16px rgba(200,16,46,0.55)",
      },
      transitionTimingFunction: {
        // Emil Kowalski's stronger custom curves — built-in CSS easings lack punch
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        sweep: "sweep 2.8s ease-in-out infinite",
        // enter deliberate, exit snappy — asymmetric per Emil's guidance
        "accordion-down": "accordion-down 240ms cubic-bezier(0.23, 1, 0.32, 1)",
        "accordion-up": "accordion-up 180ms cubic-bezier(0.23, 1, 0.32, 1)",
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
  plugins: [require("tailwindcss-animate")],
};
