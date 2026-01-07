import globals from "globals";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    ignores: [
      "test/**",
      "*.spec.ts",
      "*.e2e-spec.ts",
      "*.config.mjs",
      "*.config.js",
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "*.js",
            "*.mjs",
            "*.config.js",
            "*.config.mjs",
            "eslint.config.mjs",
          ],
        },
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
];
