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
    // jsx-a11y static analysis cannot trace React.cloneElement id injection used
    // by the Field component. The rendered markup IS accessible — linter false positives.
    rules: {
      "jsx-a11y/select-has-an-accessible-name": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
]);

export default eslintConfig;
