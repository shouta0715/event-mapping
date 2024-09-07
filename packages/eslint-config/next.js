const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", require.resolve("./react.js")],
  plugins: ["n"],
  rules: {
    "n/no-process-env": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["*.config.[jt]s"],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
