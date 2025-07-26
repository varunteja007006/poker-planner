import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Polyfill __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // If your project uses TypeScript, you might need to specify the tsconfig path here
  // resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = [
  // Extends recommended configurations from Next.js and Prettier
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript", // Include Next.js TypeScript specific rules
    "prettier"
  ),

  // Configure ESLint to run Prettier as a rule
  ...compat.config({
    plugins: {
      prettier: prettierPlugin, // Use the imported prettier plugin
    },
    rules: {
      "prettier/prettier": "error", // Report Prettier formatting issues as errors
    },
  }),

  // Optional: Add custom rules or overrides for your project
  {
    rules: {
      // Example: Warn on unused variables, ignoring those starting with '_'
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Example: Allow console.warn and console.error, but warn on others
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // You can add more specific rules here
    },
  },
];

// Import the prettier plugin directly for use in the 'plugins' object
// This is a common pattern for flat config when using plugins directly.
import prettierPlugin from "eslint-plugin-prettier";

export default eslintConfig;