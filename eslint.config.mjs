import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// https://www.cnblogs.com/jsonq/p/18357943
// https://ksh7.com/posts/eslint-update-9/#%E4%BD%BF%E7%94%A8-typescript-eslint-parser-%E8%87%AA%E5%AE%9A%E4%B9%89
// https://dev.to/jeanjavi/nuxt-eslint-9-typescript-prettier-configuration-guide-2024-4h2c

export default tseslint.config(
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
    ],
    files: ["**/*.{ts,tsx}"], // eslint 检测的文件，根据需要自行设置
    ignores: ["dist"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "@typescript-eslint/no-explicit-any": "off", // allow any type
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "all",
        },
      ],
      "react/prop-types": "off",
      "no-console": "warn",
      "prefer-destructuring": 1,
      "default-case": 2,
      eqeqeq: 2,
      "no-alert": 2,
      "no-unused-vars": 0,
      "no-unreachable": 2,
      "no-duplicate-imports": 2,
      "max-params": ["error", 8],
      "react/display-name": 0,
      "react-hooks/rules-of-hooks": 2,
      "react-hooks/exhaustive-deps": 1,
      // "react/no-unescaped-entities": 1,
      "react/jsx-uses-react": "off",
      complexity: "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-namespace": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Disable no-console for demo files and entry points
  {
    files: ["src/demo/**/*.{ts,tsx}", "src/index.tsx", "src/indexCustomized.tsx"],
    rules: {
      "no-console": "off",
    },
  },
);
