const path = require("path");

const rules = {
  // Prettier for autofix
  "prettier/prettier": "error",
  // Some logic need reassign (such sequelize hooks)
  "no-param-reassign": "off",
  // Allow for of
  "no-restricted-syntax": "off",
  // Import ordering and allow no default
  "import/prefer-default-export": "off",
  "import-helpers/order-imports": [
    "warn",
    {
      newlinesBetween: "always",
      groups: ["/^react/", "module", "/^@\\//", ["parent", "sibling", "index"]],
      alphabetize: { order: "asc", ignoreCase: true },
    },
  ],
};

module.exports = {
  env: {
    node: true,
  },
  extends: ["plugin:promise/recommended", "prettier"],
  plugins: ["promise", "import-helpers", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules,
  overrides: [
    {
      files: ["src/server/models/*.ts"],
      rules: {
        "import/no-cycle": "off",
      },
    },
    {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      env: {
        node: true,
        browser: true,
        jest: true,
      },
      extends: [
        "airbnb-typescript",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended",
        "plugin:promise/recommended",
        "prettier",
        "prettier/react",
        "prettier/@typescript-eslint",
      ],
      plugins: ["@typescript-eslint", "promise", "import-helpers", "prettier"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: path.resolve("tsconfig.json"),
      },
      rules: {
        ...rules,
        // DI in Nest
        "no-useless-constructor": "off",
        "class-methods-use-this": "off",
        // Nest dtos
        "max-classes-per-file": ["error", 4],
        // Use inference of type
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // Allow any in some logic
        "@typescript-eslint/no-explicit-any": "off",
        // Some rules that causes some issues
        "react/button-has-type": "off",
        "react/require-default-props": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "jsx-a11y/label-has-for": "off",
      },
    },
    {
      files: ["./**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      },
    },
  ],
};
