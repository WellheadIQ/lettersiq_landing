/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // Dark instrument-panel palette — deep navy canvas, rationed red,
        // cobalt data lines. Light surface tokens are remapped to the dark
        // canvas so the whole page reads as one control room.
        // ============================================================
        // Canvas system (was warm parchment — now near-black navy)
        parchment: "#060D1B", // page canvas (deepest navy)
        parchmentAlt: "#0B1526", // alternating band, one step lifted
        card: "#0F1C34", // elevated panel surface

        oxford: "#0A1428", // structural navy: emphasis panels
        midnight: "#060D1B", // deepest navy: hero stage, footer
        slateNavy: "#16294A", // elevated navy panel on dark

        signalRed: "#C8102E", // rationed accent: CTA, critical, active — surfaces, rules, marks
        signalBright: "#FF3B54", // brighter red for hover/alert glow
        signalText: "#FF3B54", // red TEXT on dark surfaces (signalRed reads 3.3:1 there)
        signalInk: "#B00C28", // red TEXT on the light inset, incl. the signalSoft wash
        signalSoft: "rgba(200,16,46,0.14)", // soft red wash for badges

        cobalt: "#3D6BFF", // data lines / info (lifted for dark-bg contrast)
        cobaltText: "#7AA0FF", // cobalt for text/links on dark
        cobaltInk: "#2F55D4", // cobalt TEXT on the light inset
        unionBlue: "#0A3161", // deep blue linework / info-deep
        cobaltSoft: "rgba(61,107,255,0.12)",

        starWhite: "#FAFBFF", // primary text on dark

        // Light inset (the one intentional off-white artifact: briefing panel)
        panelLight: "#F4F6FB",
        panelLightAlt: "#E7ECF5",
        panelInk: "#0A1428", // ink text ON the light inset
        panelInkMuted: "#4A5568",

        // Neutral ink ramp — now light-on-dark
        ink: "#EAEEF6",
        inkMuted: "#9AA6BC",
        inkFaint: "#63708A",

        // Hairlines — light on dark
        line: "rgba(233,238,247,0.10)",
        lineStrong: "rgba(233,238,247,0.20)",
        lineDark: "rgba(250,251,255,0.14)",
        lineDarkStrong: "rgba(250,251,255,0.28)",

        // ------------------------------------------------------------
        // Semantic aliases — remapped to the dark system so legacy class
        // names (labBg / labFg / paper…) resolve to the control-room palette.
        // ------------------------------------------------------------
        paper: "#060D1B",
        paperAlt: "#0B1526",
        paperPanel: "#0F1C34",
        ember: "#C8102E",
        emberBright: "#FF3B54",
        emberSoft: "rgba(200,16,46,0.14)",
        steel: "#3D6BFF",
        labBg: "#060D1B",
        labBgAlt: "#0B1526",
        labFg: "#EAEEF6", // primary text (light)
        labFgMuted: "#9AA6BC", // muted text (light)
        labAccent: "#FF3B54",
        labAlert: "#FF3B54",
        labBorder: "rgba(233,238,247,0.10)",
        labBorderStrong: "rgba(233,238,247,0.20)",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        display: ["Archivo", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-sm": ["clamp(2.25rem, 6vw, 3.25rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        display: ["clamp(2.75rem, 7.5vw, 5rem)", { lineHeight: "0.94", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(3rem, 9.5vw, 6.5rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
      },
      maxWidth: {
        content: "80rem",
      },
      // Tailwind 3.3 ships no numeric min-height/min-width scale, so `min-h-11`
      // silently emitted nothing and every 44px touch target collapsed to its
      // line box. 11 = the 44px WCAG 2.2 target-size floor.
      minHeight: {
        11: "2.75rem",
      },
      minWidth: {
        11: "2.75rem",
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
        // Depth on a near-black canvas: a tight contact shadow plus a long,
        // very soft cast — a single blurry shadow just reads as haze.
        float:
          "0 2px 4px rgba(0,0,0,0.45), 0 12px 24px -12px rgba(0,0,0,0.7), 0 44px 90px -36px rgba(0,0,0,0.95)",
      },
      transitionTimingFunction: {
        // Single source of truth: the transitions.dev --ease-smooth-out token,
        // defined in src/styles/transitions.css.
        "out-strong": "var(--ease-smooth-out)",
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
        // Symmetric on purpose: an accordion reads as one reversible motion,
        // not an open/close pair, so both halves share duration and easing.
        "accordion-down": "accordion-down var(--duration-fast) var(--ease-smooth-out)",
        "accordion-up": "accordion-up var(--duration-fast) var(--ease-smooth-out)",
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
