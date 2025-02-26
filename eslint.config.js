import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  { settings: { react: { version: "detect" } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.test.js"],
    ...pluginJest.configs["flat/all"],
  },
  {
    ignores: ["dist", "sandbox/web/bundle.js"],
  },
  {
    rules: {
      "consistent-return": "off",
      "id-length": "off",
      "max-lines-per-function": ["error", { max: 200 }],
      "max-statements": "off",
      "no-console": "error",
      "no-magic-numbers": "off",
      "no-plusplus": "off",
      "no-shadow": "off",
      "no-ternary": "off",
      "one-var": "off",
      "prefer-destructuring": "off",
      "sort-imports": "off",
    },
  },
];
