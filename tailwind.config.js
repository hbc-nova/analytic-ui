/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // "./src/components/**/*.{vue,js,ts}",
    // "./src/pages/**/*.{vue,js,ts}",
    // "./src/router/**/*.{vue,js,ts}",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#053582", // Dark Blue
          light: "#3B82F6", // Lighter Blue
          dark: "#1E40AF", // Darker Blue
        },
        secondary: {
          DEFAULT: "#7C3AED", // Purple
          light: "#A78BFA", // Lighter Purple
          dark: "#6D28D9", // Darker Purple
        },
        accent: {
          DEFAULT: "#F59E0B", // Amber
          light: "#FBBF24", // Lighter Amber
          dark: "#D97706", // Darker Amber
        },
        info: {
          DEFAULT: "#0EA5E9", // Sky Blue
          light: "#38BDF8", // Lighter Sky Blue
          dark: "#0284C7", // Darker Sky Blue
        },
        success: {
          DEFAULT: "#10B981", // Green
          light: "#34D399", // Lighter Green
          dark: "#059669", // Darker Green
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber (shared with accent)
          light: "#FBBF24", // Lighter Amber
          dark: "#D97706", // Darker Amber
        },
        danger: {
          DEFAULT: "#EF4444", // Red
          light: "#F87171", // Lighter Red
          dark: "#DC2626", // Darker Red
        },
        neutral: {
          DEFAULT: "#6B7280", // Gray
          light: "#9CA3AF", // Lighter Gray
          dark: "#4B5563", // Darker Gray
        },
      },
    },
  },
  plugins: [],
};
