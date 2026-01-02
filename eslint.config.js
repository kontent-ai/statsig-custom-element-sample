import kontentAiReactConfig from "@kontent-ai/eslint-config/react";
import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      ".netlify/**",
      "example-client/dist/**",
      "example-client/node_modules/**",
      "*.config.ts",
      "eslint.config.js",
    ],
  },
  {
    extends: [kontentAiReactConfig],
    files: ["src/**/*.ts", "src/**/*.tsx"],
  },
  {
    extends: [kontentAiReactConfig],
    files: ["example-client/src/**/*.ts", "example-client/src/**/*.tsx", "example-client/scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./example-client/tsconfig.json",
      },
    },
  },
  {
    extends: [kontentAiConfig],
    files: ["netlify/functions/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./netlify/functions/tsconfig.json",
      },
    },
  },
  {
    extends: [kontentAiConfig],
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./scripts/tsconfig.json",
      },
    },
  },
]);
