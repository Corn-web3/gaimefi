module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          650: "#7C3AED",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
