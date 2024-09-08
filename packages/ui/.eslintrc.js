/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@event-mapping/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
