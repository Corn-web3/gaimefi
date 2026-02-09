// .eslintrc.js
module.exports = {
  plugins: ["react-hooks"],
  rules: {
    // Turn off all rules that might be annoying
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/display-name": "off",
    "no-console": "off",
    // Turn off prop-types check if using TypeScript
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};
