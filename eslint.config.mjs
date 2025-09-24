import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  // Ignore dist and build artifacts
  {
    ignores: ["dist", "build", "artifacts"],
  },

  // TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Playwright
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts"],
    rules: {
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
    },
  },

  // Prettier
  {
    ...prettier,
  },
]);
