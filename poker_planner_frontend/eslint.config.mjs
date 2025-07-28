import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier"; // Import the plugin directly

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
    "next/typescript",
    "prettier"
  ),

  // Configure ESLint to run Prettier as a rule
  {
    // Define plugins as an object in flat config format
    plugins: {
      prettier: prettierPlugin, // Use the imported plugin object here
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;