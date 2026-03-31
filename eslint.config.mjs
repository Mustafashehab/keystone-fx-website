import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment":     "off",
      "@typescript-eslint/no-require-imports": "off",
      "react/no-unescaped-entities":           "off",
      "@next/next/no-html-link-for-pages":     "off",
      "react-hooks/set-state-in-effect":       "off",
      "@typescript-eslint/no-explicit-any":    "warn",
      "@typescript-eslint/no-unused-vars":     "warn",
      "react-hooks/exhaustive-deps":           "warn",
      "@next/next/no-img-element":             "warn",
    },
  },
]);

export default eslintConfig;