import type { Config } from "tailwindcss";

/**
 * FORGE Design System — Tailwind config
 * All design tokens from the locked spec (v2.1) live here.
 * Change a color here → changes everywhere in the app.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: "#0A0A0A",          // Main screen background
        surface: "#1A1A1A",     // Cards, input fields
        surface2: "#222222",    // Elevated surfaces (input fields inside cards)
        separator: "#1F1F1F",   // Thin divider lines

        // Text
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        "text-placeholder": "#4B5563",

        // Purple (use sparingly — ONE per screen)
        purple: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          pressed: "#7C3AED",
        },

        // Functional
        success: "#10B981",
        warning: "#F59E0B",
        destructive: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        button: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
