export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#0D9488", // Teal
          dark: "#2DD4BF", // Bright Cyan
        },
        secondary: {
          light: "#F43F5E", // Rose
          dark: "#FB7185", // Soft Rose
        },
        accent: {
          light: "#F59E0B", // Amber
          dark: "#FBBF24", // Golden
        },
        background: {
          light: "#FFFFFF",
          dark: "#0D0221", // Midnight Purple
        },
        surface: {
          light: "#F0FDFA", // Teal Tint
          dark: "#1A0B2E", // Deep Purple
        },
        text: {
          high: {
            light: "#111827",
            dark: "#F5F3FF",
          },
          muted: {
            light: "#4B5563",
            dark: "#9CA3AF",
          },
        },
      },
      borderRadius: {
        quiz: "1.25rem", // Consistent rounding for the "Playbook" look
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        edu: ["Edu AU VIC WA NT Hand", "cursive"],
        nerko: ["Nerko One", "cursive"],
      },
    },
  },
};
