/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        // ABC Brand Palette

        abc: {
          red: "#8B0000",

          "red-deep": "#6B0000",

          "red-hover": "#A00000",

          gold: "#D4AF37",

          "gold-light": "#E5C158",
        },

        // Semantic Colors

        success: {
          DEFAULT: "#10B981",

          light: "#D1FAE5",

          dark: "#065F46",
        },

        warning: {
          DEFAULT: "#F59E0B",

          light: "#FEF3C7",

          dark: "#92400E",
        },

        danger: {
          DEFAULT: "#DC2626",

          light: "#FEE2E2",

          dark: "#991B1B",
        },

        info: {
          DEFAULT: "#0066CC",

          light: "#DBEAFE",

          dark: "#1E40AF",
        },

        // Neutrals

        neutral: {
          50: "#F9FAFB",

          100: "#F3F4F6",

          200: "#E5E7EB",

          300: "#D1D5DB",

          400: "#9CA3AF",

          500: "#6B7280",

          600: "#4B5563",

          700: "#374151",

          800: "#1F2937",

          900: "#111827",
        },
      },

      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },

      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",

        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",

        "slide-in": "slideIn 0.4s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },

          "100%": { opacity: "1" },
        },

        slideIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },

          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },

  plugins: [],
};
