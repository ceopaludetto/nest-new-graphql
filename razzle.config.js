/* eslint-disable global-require */
const LoadablePlugin = require("@loadable/webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const LodashPlugin = require("lodash-webpack-plugin");
const path = require("path");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

process.env.RAZZLE_LOADABLE_MANIFEST = path.resolve("build", "loadable-stats.json");

const measure = process.argv.some((arg) => arg === "--measure");

const smp = new SpeedMeasureWebpackPlugin({ disable: !measure });

module.exports = {
  experimental: {
    reactRefresh: true,
    newBabel: true,
    newExternals: true,
    newSplitChunks: true,
    newContentHash: true,
    newMainFields: true,
  },
  plugins: [
    {
      name: "typescript",
      options: {
        useBabel: true,
        forkTsChecker: {
          tslint: false,
        },
      },
    },
  ],
  modifyPaths({ paths }) {
    paths.appClientIndexJs = path.resolve("src", "client", "index.tsx");
    paths.appServerIndexJs = path.resolve("src", "server", "index.ts");

    return paths;
  },
  modifyWebpackOptions({ options: { webpackOptions } }) {
    webpackOptions.fileLoaderExclude.push(/\.graphql$/);

    return webpackOptions;
  },
  modifyWebpackConfig({ webpackConfig: config, env: { target, dev } }) {
    if (target === "node" && !dev) {
      config.optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              mangle: false,
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            sourceMap: true,
          }),
        ],
      };
    }

    config.resolve.alias["@"] = path.resolve("src");
    config.resolve.alias["lodash-es"] = "lodash";

    // add lodash plugin
    config.plugins.unshift(new LodashPlugin());

    if (target === "web") {
      config.plugins.unshift(
        new LoadablePlugin({ writeToDisk: { filename: path.resolve("build") }, outputAsset: false })
      );

      if (!dev) {
        config.optimization.runtimeChunk = {
          name: "runtime",
        };

        config.plugins.unshift(new CompressionPlugin({ exclude: [/\.map$/, /\.txt$/] }));
      }
    }

    const ts = config.module.rules.find((x) => {
      if (Array.isArray(x.use)) {
        return x.use.some((u) => u.loader.includes("babel-loader"));
      }

      return false;
    });

    // add graphql tag loader
    config.module.rules.unshift({
      test: /\.graphql$/,
      use: [...ts.use, require.resolve("graphql-let/loader")],
    });

    return smp.wrap(config);
  },
};
