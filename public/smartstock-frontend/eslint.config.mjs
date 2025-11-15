import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // In our API wrapper we export methods that some pages may not use yet
      'no-unused-vars': ['warn', { varsIgnorePattern: '^api$' }],
    }
  },
  {
    files: ['app/**/page.tsx'],
    rules: {
      // We manage initial load with explicit mount effects
      'react-hooks/exhaustive-deps': 'warn',
    }
  }
]);

export default eslintConfig;
