/* eslint-disable no-template-curly-in-string */
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = (isServer = false, isTest = false) => ({
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
        useBuiltIns: "entry",
        shippedProposals: true,
        corejs: 3,
        bugfixes: true,
        configPath: path.resolve(process.cwd()),
        exclude: ["transform-typeof-symbol"],
        ...(isServer || isTest
          ? {
              targets: {
                node: "current",
              },
            }
          : {}),
      },
    ],
    [
      "@babel/preset-react",
      {
        useBuiltIns: true,
        development: !isProd,
      },
    ],
  ],
  plugins: [
    "lodash",
    "graphql-tag",
    "optimize-clsx",
    "@loadable/babel-plugin",
    "date-fns",
    [
      "@babel/plugin-transform-destructuring",
      {
        loose: true,
        selectiveLoose: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer",
          "useCallback",
          "useMemo",
          "useRef",
          "useImperativeHandle",
          "useLayoutEffect",
          "useDebugValue",
        ],
      },
    ],
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: false,
        regenerator: true,
        helpers: true,
        useESModules: !isServer,
        version: require("@babel/runtime/package.json").version, // eslint-disable-line global-require
      },
    ],
    ["@babel/plugin-proposal-object-rest-spread", { useBuiltIns: true }],
    ["transform-react-remove-prop-types", { mode: "remove", removeImport: true }],
    [
      "transform-imports",
      {
        "react-use": {
          transform: isServer ? "react-use/lib/${member}" : "react-use/esm/${member}",
          preventFullImport: true,
        },
        "mdi-norm": {
          transform: isServer ? "mdi-norm/lib/${member}" : "mdi-norm/es/${member}",
          preventFullImport: true,
          skipDefaultConversion: true,
        },
      },
    ],
    ...(isTest
      ? ["babel-plugin-dynamic-import-node", ["@babel/plugin-transform-modules-commonjs", { loose: true }]]
      : []),
  ],
});
