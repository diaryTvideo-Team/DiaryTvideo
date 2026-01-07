import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    ignores: ["*.config.mjs", "*.config.ts", "*.config.js"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
