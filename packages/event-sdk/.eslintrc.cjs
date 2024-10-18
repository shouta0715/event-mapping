/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@event-mapping/eslint-config/typescript.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-underscore-dangle": "off",
  },
};
